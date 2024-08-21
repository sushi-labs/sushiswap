import { Prisma, SteerStrategy } from '@sushiswap/database'
import { getSteerVaults } from '@sushiswap/graph-client/steer'
import {
  STEER_SUPPORTED_CHAIN_IDS,
  SteerChainId,
  getStrategiesPayloads,
  getVaultAprs,
  getVerifiedVaults,
} from '@sushiswap/steer-sdk'
import { ID, chainName, isPromiseFulfilled } from 'sushi'
import { TickMath } from 'sushi/pool/sushiswap-v3'

import { updatePoolsWithSteerVaults } from './etl/pool/load.js'
import {
  deprecateVaults,
  enableVaults,
  upsertVaults,
} from './etl/steer/load.js'
import { getTokenPrices } from './lib/price.js'

export async function steer() {
  console.log('Starting steer')

  try {
    const startTime = performance.now()
    const chainsWithVaults = await extract()

    const transformed = transform(chainsWithVaults)

    await upsertVaults(transformed)
    await updatePoolsWithSteerVaults()

    await enable()
    await deprecate()

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

async function enable() {
  const results = await Promise.allSettled(
    STEER_SUPPORTED_CHAIN_IDS.map((chainId) => getVerifiedVaults({ chainId })),
  )

  const verifiedVaults = results
    .filter(isPromiseFulfilled)
    .flatMap((r) => r.value)

  await enableVaults(verifiedVaults)
}

async function deprecate() {
  const deprecatedVaults = await fetch(
    'https://ro81h8hq6b.execute-api.us-east-1.amazonaws.com/deprecated-bundles',
  )
    .then((data) => data.json())
    .then((data: { id: string; chainId: number; type: string }[]) =>
      data.filter((el) => el.type === 'VAULT'),
    )

  await deprecateVaults(deprecatedVaults.map((vault) => vault.id))
}

async function extract() {
  const result = await Promise.allSettled(
    STEER_SUPPORTED_CHAIN_IDS.map((chainId) =>
      extractChain(chainId).catch((e) => {
        console.log(
          'Steer: Extract failed for chain',
          chainName[chainId],
          e.message,
        )
        throw e
      }),
    ),
  )

  return result.filter(isPromiseFulfilled).map((r) => r.value)
}

async function extractChain(chainId: SteerChainId) {
  const { getPools } = await import('@sushiswap/client')

  const prices = await getTokenPrices({ chainId })
  const vaults = await getSteerVaults(
    {
      chainId,
      first: Infinity,
    },
    { retries: 3 },
  )

  const poolIds = vaults
    .filter((vault) => !!vault.pool)
    .map((vault) => vault.pool.id)

  const pools = [] as Awaited<ReturnType<typeof getPools>>

  while (poolIds.length > 0) {
    const poolIdsChunk = poolIds.splice(0, 100)
    const poolsChunk = await getPools({
      ids: poolIdsChunk as ID[],
      chainIds: [chainId],
    })
    pools.push(...poolsChunk)
  }

  const payloadIpfsHashes = vaults.map((vault) => vault.payloadIpfs)
  const payloads: Awaited<ReturnType<typeof getStrategiesPayloads>> = []

  while (payloadIpfsHashes.length > 0) {
    const payloadIpfsHashesChunk = payloadIpfsHashes.splice(0, 10)
    const payloadsChunk = await getStrategiesPayloads({
      payloadHashes: payloadIpfsHashesChunk,
    })
    payloads.push(...payloadsChunk)
  }

  let aprs

  try {
    aprs = await getVaultAprs({ chainId })
  } catch (e: any) {
    console.error(`Failed to fetch aprs for chainId: ${chainId}`, e.message)
    aprs = {}
  }

  const vaultsWithPayloads = await Promise.allSettled(
    vaults.map(async (vault, i) => {
      const pool = pools.find((pool) => pool.id === vault.pool.id)

      const {
        apr1d = null,
        apr1w = null,
        apr1m = null,
        apr = null,
      } = aprs[vault.id] || {}

      const payload = payloads[i]

      const token0Price = prices[vault.token0.address.toLowerCase()] || 0
      const token1Price = prices[vault.token1.address.toLowerCase()] || 0

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

      return {
        ...vault,
        payload,
        apr1d,
        apr1w,
        apr1m,
        apr,
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

const StrategyTypes: Record<string, SteerStrategy> = {
  'Static Super Wide Strategy': SteerStrategy.SuperWide,
  'Classic Rebalance Strategy': SteerStrategy.ClassicRebalance,
  'Classic Rebalance Strategy V2': SteerStrategy.ClassicRebalance,
  'Delta Neutral - Stables': SteerStrategy.DeltaNeutralStables,
  'Stable Expansion Strategy': SteerStrategy.ElasticExpansion,
  'Elastic Expansion Strategy': SteerStrategy.ElasticExpansion,
  'Elastic Expansion Strategy V2': SteerStrategy.ElasticExpansion,
  'High Low Channel Strategy': SteerStrategy.HighLowChannel,
  'High Low Channel Strategy - Medium Range': SteerStrategy.HighLowChannel,
  'High Low Channel Strategy - Narrow Range': SteerStrategy.HighLowChannel,
  'High Low Channel Strategy V2': SteerStrategy.HighLowChannel,
  'Moving Volatility Channel': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Channel Strategy': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Channel Strategy - Medium':
    SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Strategy V2': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Strategy V2.': SteerStrategy.MovingVolatilityChannel,
  'Moving Volatility Channel Strategy V2':
    SteerStrategy.MovingVolatilityChannel,
  'Channel Multiplier Strategy': SteerStrategy.ChannelMultiplier,
  'Algebra Channel Multiplier': SteerStrategy.ChannelMultiplier,
  'MIM-USDC Stable Strategy': SteerStrategy.StaticStable,
  'Relative Static Stable Strategy': SteerStrategy.StaticStable,
  'Generic Static Stable Strategy': SteerStrategy.StaticStable,
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
  const vaults = chainsWithVaults.flatMap(({ chainId, vaults }) =>
    vaults.flatMap((vault) => {
      // ! Missing strategies will be ignored
      const strategyType = vault?.payload?.strategyConfigData.name
        ? StrategyTypes[vault.payload.strategyConfigData.name]
        : null

      if (!strategyType) {
        return []
      }

      let lastAdjustmentTimestamp = Math.floor(
        vault.payload!.strategyConfigData.epochStart,
      )
      if (lastAdjustmentTimestamp > 1000000000000) {
        lastAdjustmentTimestamp = Math.floor(lastAdjustmentTimestamp / 1000)
      }

      return {
        id: vault.id.toLowerCase(),
        address: vault.address.toLowerCase(),
        chainId: chainId,

        poolId: vault.pool.id,
        feeTier: Number(vault.feeTier) / 1000000,

        // apr1d, apr1m, apr1y are from the subgraph and inaccurate
        apr: vault.apr || 0,
        apr1d: vault.apr1d || 0,
        apr1w: vault.apr1w || 0,
        apr1m: vault.apr1m || 0,
        apr1y: 0,

        token0Id: vault.token0.id.toLowerCase(),
        reserve0: String(vault.reserve0),
        reserve0USD: vault.reserve0USD,
        fees0: String(vault.fees0),
        fees0USD: vault.fees0USD,

        token1Id: vault.token1.id.toLowerCase(),
        reserve1: String(vault.reserve1),
        reserve1USD: vault.reserve1USD,
        fees1: String(vault.fees1),
        fees1USD: vault.fees1USD,

        reserveUSD: vault.reserveUSD,
        feesUSD: vault.feesUSD,

        strategy: strategyType,
        payloadHash: vault.payloadIpfs,
        description: '', // not used
        state: 'PendingThreshold', // unused

        performanceFee: 0.15, // currently constant

        lowerTick: vault.lowerTick
          ? Number(vault.lowerTick)
          : TickMath.MIN_TICK,
        upperTick: vault.upperTick
          ? Number(vault.upperTick)
          : TickMath.MAX_TICK,

        adjustmentFrequency: Number(
          vault.payload?.strategyConfigData.epochLength ?? 0
        ),
        lastAdjustmentTimestamp,

        admin: vault.strategyToken.admin,
        creator: vault.strategyToken.creator.id,
        manager: vault.manager,
      } satisfies Prisma.SteerVaultCreateManyInput
    }),
  )
  console.log(`TRANSFORM: ${vaults.length} vaults`)
  return vaults
}
