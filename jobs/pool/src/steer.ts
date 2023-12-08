import { Prisma, SteerStrategy, VaultState } from '@sushiswap/database'
import {
  STEER_ENABLED_NETWORKS,
  STEER_SUBGRAPH_URL,
  SteerChainId,
} from '@sushiswap/graph-config'
import {
  getSteerStrategyPayload,
  getSteerVaultAprs,
} from '@sushiswap/steer-sdk'
import { TickMath } from '@sushiswap/v3-sdk'
import { isPromiseFulfilled } from 'sushi'
import { getIdFromChainIdAddress } from 'sushi/format'

import { getBuiltGraphSDK } from '../.graphclient/index.js'
import { updatePoolsWithSteerVaults } from './etl/pool/load.js'
import { upsertVaults } from './etl/steer/load.js'

export async function steer() {
  console.log('Starting steer')

  try {
    const startTime = performance.now()
    const chainsWithVaults = await extract()

    const transformed = transform(chainsWithVaults)

    await upsertVaults(transformed)
    await updatePoolsWithSteerVaults()

    const endTime = performance.now()
    console.log(
      `COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(
        1,
      )} seconds. `,
    )
  } catch (e) {
    console.error(e)
  }
}

async function extractChain(chainId: SteerChainId) {
  const sdk = getBuiltGraphSDK({
    url: STEER_SUBGRAPH_URL[chainId],
  })

  const { getTokenPricesChain, getPools } = await import('@sushiswap/client')

  const prices = await getTokenPricesChain({ chainId })

  const { vaults } = await sdk.SteerVaults()

  const poolIds = vaults
    .filter((vault) => !!vault.pool)
    .map((vault) => `${chainId}:${vault.pool.toLowerCase()}`)

  const pools = [] as Awaited<ReturnType<typeof getPools>>

  while (poolIds.length > 0) {
    const poolIdsChunk = poolIds.splice(0, 100)
    const poolsChunk = await getPools({
      ids: poolIdsChunk,
      chainIds: [chainId],
    })
    pools.push(...poolsChunk)
  }

  const vaultsWithPayloads = await Promise.allSettled(
    vaults.map(async (vault) => {
      const poolId = `${chainId}:${vault.pool.toLowerCase()}`
      const pool = pools.find((pool) => pool.id === poolId)

      const token0Price = prices[vault.token0] || 0
      const token1Price = prices[vault.token1] || 0

      const reserve0USD = pool
        ? (Number(vault.reserve0) / 10 ** pool.token0.decimals) * token0Price
        : 0
      const fees0USD = pool
        ? (Number(vault.fees0) / 10 ** pool.token0.decimals) * token0Price
        : 0

      const reserve1USD = pool
        ? (Number(vault.reserve1) / 10 ** pool.token1.decimals) * token1Price
        : 0
      const fees1USD = pool
        ? (Number(vault.fees1) / 10 ** pool.token1.decimals) * token1Price
        : 0

      const reserveUSD = reserve0USD + reserve1USD
      const feesUSD = Number(fees0USD) + Number(fees1USD)

      const [payloadP, aprP] = await Promise.allSettled([
        getSteerStrategyPayload({ payloadHash: vault.payloadIpfs }),
        getSteerVaultAprs({
          vaultId: getIdFromChainIdAddress(chainId, vault.id as `0x${string}`),
        }),
      ])

      const payload = isPromiseFulfilled(payloadP) ? payloadP.value : null
      const {
        apr: annualPercentageYield,
        apr1d: annualPercentageDailyYield,
        apr1w: annualPercentageWeeklyYield,
      } = isPromiseFulfilled(aprP) && aprP.value
        ? aprP.value
        : { apr: null, apr1d: null, apr1w: null }

      return {
        ...vault,
        poolId,
        payload,
        annualPercentageYield,
        annualPercentageDailyYield,
        annualPercentageWeeklyYield,
        reserve0USD,
        fees0USD,
        reserve1USD,
        fees1USD,
        reserveUSD,
        feesUSD,
      }
    }),
  )

  return {
    chainId,
    vaults: vaultsWithPayloads.filter(isPromiseFulfilled).map((r) => r.value),
  }
}

async function extract() {
  const result = await Promise.allSettled(
    STEER_ENABLED_NETWORKS.map(extractChain),
  )
  return result.filter(isPromiseFulfilled).map((r) => r.value)
}

const StrategyTypes: Record<string, SteerStrategy> = {
  'Classic Rebalance Strategy': SteerStrategy.ClassicRebalance,
  'Delta Neutral - Stables': SteerStrategy.DeltaNeutralStables,
  'Elastic Expansion Strategy': SteerStrategy.ElasticExpansion,
  'High Low Channel Strategy': SteerStrategy.HighLowChannel,
  'High Low Channel Strategy - Medium Range': SteerStrategy.HighLowChannel,
  'High Low Channel Strategy - Narrow Range': SteerStrategy.HighLowChannel,
  'Moving Volatility Channel': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Channel Strategy': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Channel Strategy - Medium':
    SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Strategy V2': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Strategy V2.': SteerStrategy.MovingVolatilityChannel,
  'Channel Multiplier Strategy': SteerStrategy.ChannelMultiplier,
  'Static Stable Strategy': SteerStrategy.StaticStable,
  'Static Stable Strategy ': SteerStrategy.StaticStable,
  'Static Stable 1% Strategy': SteerStrategy.StaticStable,
  'Static Stable 0.3% Strategy': SteerStrategy.StaticStable,
  'Static Stable 0.05% Strategy': SteerStrategy.StaticStable,
  'Static Stable Strategy V2': SteerStrategy.StaticStable,
  'Keltner Algo': SteerStrategy.KeltnerAlgo,
  'Bollinger Algo': SteerStrategy.BollingerAlgo,
  'Fixed Percentage Strategy': SteerStrategy.FixedPercentage,
  'Price Multiplier Strategy': SteerStrategy.PriceMultiplier,
}

function transform(
  chainsWithVaults: Awaited<ReturnType<typeof extract>>,
): Prisma.SteerVaultCreateManyInput[] {
  return chainsWithVaults.flatMap(({ chainId, vaults }) =>
    vaults.flatMap((vault) => {
      // ! Missing strategies will be ignored
      const strategyType = vault?.payload?.strategyConfigData.name
        ? StrategyTypes[vault.payload.strategyConfigData.name]
        : null

      if (!strategyType) return []

      const lowTicks = vault.positions.flatMap((position) => position.lowerTick)
      const lowestTick = Math.max(
        lowTicks.reduce(
          (lowest, tick) => (Number(tick) < lowest ? Number(tick) : lowest),
          Number(lowTicks[0] || 0),
        ),
        TickMath.MIN_TICK,
      )

      const highTicks = vault.positions.flatMap(
        (position) => position.upperTick,
      )
      const highestTick = Math.min(
        highTicks.reduce(
          (highest, tick) => (Number(tick) > highest ? Number(tick) : highest),
          Number(highTicks[0] || 0),
        ),
        TickMath.MAX_TICK,
      )

      let lastAdjustmentTimestamp = Math.floor(
        vault.payload!.strategyConfigData.epochStart,
      )
      if (lastAdjustmentTimestamp > 1000000000000) {
        lastAdjustmentTimestamp = Math.floor(lastAdjustmentTimestamp / 1000)
      }

      return {
        id: `${chainId}:${vault.id}`.toLowerCase(),
        address: vault.id.toLowerCase(),
        chainId: chainId,

        poolId: vault.poolId,
        feeTier: Number(vault.feeTier) / 1000000,

        // apr1d, apr1m, apr1y are from the subgraph and inaccurate
        apr: Number(vault.annualPercentageYield),
        apr1w: Number(vault.annualPercentageWeeklyYield),
        apr1d: Number(vault.annualPercentageDailyYield),
        apr1m: Number(vault.annualPercentageMonthlyYield),
        apr1y: Number(vault.annualPercentageYearlyYield),

        token0Id: `${chainId}:${vault.token0}`.toLowerCase(),
        reserve0: vault.reserve0 as string,
        reserve0USD: vault.reserve0USD,
        fees0: vault.fees0 as string,
        fees0USD: vault.fees0USD,

        token1Id: `${chainId}:${vault.token1}`.toLowerCase(),
        reserve1: vault.reserve1 as string,
        reserve1USD: vault.reserve1USD,
        fees1: vault.fees1 as string,
        fees1USD: vault.fees1USD,

        reserveUSD: vault.reserveUSD,
        feesUSD: vault.feesUSD,

        strategy: strategyType,
        payloadHash: vault.payloadIpfs,
        description: vault.payload!.strategyConfigData.description,
        state: Object.values(VaultState)[vault.state],

        performanceFee: 0.15, // currently constant

        lowerTick: lowestTick,
        upperTick: highestTick,

        adjustmentFrequency: Number(
          vault.payload!.strategyConfigData.epochLength,
        ),
        lastAdjustmentTimestamp,

        admin: vault.strategyToken.admin,
        creator: vault.strategyToken.creator.id,
        manager: vault.manager,
      } satisfies Prisma.SteerVaultCreateManyInput
    }),
  )
}
