/* eslint-disable turbo/no-undeclared-env-vars */
import './lib/wagmi.js'

import { totalsAbi } from 'sushi/abi'
import {
  BENTOBOX_ADDRESS,
  BentoBoxChainId,
  isBentoBoxChainId,
} from '@sushiswap/bentobox-sdk'
import { ChainId } from 'sushi/chain'
import { USDC_ADDRESS } from 'sushi/currency'
import { Prisma, PrismaClient, Protocol, Token } from '@sushiswap/database'
import { SWAP_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import {
  calcTokenPrices,
  CLRPool,
  ConstantProductRPool,
  Rebase,
  RPool,
  RToken,
  StableSwapRPool,
  toShareBI,
} from '@sushiswap/tines'
import { TICK_SPACINGS } from '@sushiswap/v3-sdk'
import { Address, fetchBlockNumber, readContracts } from '@wagmi/core'
import { isAddress } from 'ethers/lib/utils.js'
import { performance } from 'perf_hooks'

import {
  getConcentratedLiquidityPoolReserves,
  getConstantProductPoolReserves,
  getStablePoolReserves,
} from './lib/reserves.js'

export enum Price {
  USD = 'USD',
  NATIVE = 'NATIVE',
}

export async function prices() {
  const client = new PrismaClient()
  try {
    const startTime = performance.now()
    for (const chainId of SWAP_ENABLED_NETWORKS) {
      const price = Price.USD
      const base = USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS]
      if (!isAddress(base) || !base) {
        console.log(
          `Base token (${base}) is not a valid address, given the chainId: ${chainId}. SKIPPING`,
        )
        continue
      }
      console.log(
        `Arguments: CHAIN_ID: ${chainId}, BASE: ${base}, PRICE: ${price}`,
      )

      const baseToken = await getBaseToken(client, chainId, base)
      if (!baseToken) {
        console.log(
          `Base token (${base}) does not exist in the database. chainId: ${chainId}. SKIPPING`,
        )
        continue
      }
      const minimumLiquidity = 500 * 10 ** baseToken.decimals // 500 USDC
      const pools = await getPools(client, chainId)
      const { rPools, tokens } = await transform(chainId, pools)
      const tokensToUpdate = calculatePrices(
        rPools,
        minimumLiquidity,
        baseToken,
        tokens,
      )
      await updateTokenPrices(client, price, tokensToUpdate)
    }
    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function getBaseToken(
  client: PrismaClient,
  chainId: ChainId,
  address: string,
) {
  const baseToken = await client.token.findFirst({
    select: {
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      chainId,
      address: address.toLowerCase(),
    },
  })

  return baseToken
}

async function getPools(client: PrismaClient, chainId: ChainId) {
  const startTime = performance.now()

  const batchSize = 2500
  let cursor = null
  const results: Pool[] = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result: Pool[] = []
    if (!cursor) {
      result = await getPoolsByPagination(client, chainId, batchSize)
    } else {
      result = await getPoolsByPagination(client, chainId, batchSize, 1, {
        id: cursor,
      })
    }

    cursor = result.length === batchSize ? result[result.length - 1]?.id : null
    totalCount += result.length
    results.push(...result)
    const requestEndTime = performance.now()
    console.log(
      `Fetched a batch of pools with ${result.length} (${(
        (requestEndTime - requestStartTime) /
        1000
      ).toFixed(1)}s). cursor: ${cursor}, total: ${totalCount}`,
    )
  } while (cursor != null)
  const endTime = performance.now()

  console.log(
    `Fetched ${results.length} pools (${((endTime - startTime) / 1000).toFixed(
      1,
    )}s). `,
  )
  return results
}

async function getPoolsByPagination(
  client: PrismaClient,
  chainId: ChainId,
  take: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput,
): Promise<Pool[]> {
  return client.sushiPool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
      address: true,
      chainId: true,
      token0: true,
      token1: true,
      swapFee: true,
      protocol: true,
    },
    where: {
      chainId,
      protocol: {
        in: [
          Protocol.SUSHISWAP_V2,
          Protocol.SUSHISWAP_V3,
          Protocol.BENTOBOX_CLASSIC,
          Protocol.BENTOBOX_STABLE,
        ],
      },
      token0: {
        status: 'APPROVED',
      },
      token1: {
        status: 'APPROVED',
      },
    },
  })
}

async function transform(chainId: ChainId, pools: Pool[]) {
  const tokens: Map<string, Token> = new Map()
  const stablePools = pools.filter(
    (pool) => pool.protocol === Protocol.BENTOBOX_STABLE,
  )
  const blockNumber = await fetchBlockNumber({ chainId })
  console.log(`ChainId ${chainId} got block number: ${blockNumber}. `)
  const rebases = isBentoBoxChainId(chainId)
    ? await fetchRebases(stablePools, chainId, blockNumber)
    : undefined

  const constantProductPoolIds = pools
    .filter(
      (p) =>
        p.protocol === Protocol.BENTOBOX_CLASSIC ||
        p.protocol === Protocol.SUSHISWAP_V2,
    )
    .map((p) => p.id)
  const stablePoolIds = stablePools.map((p) => p.id)
  const concentratedLiquidityPools = pools.filter(
    (p) => p.protocol === Protocol.SUSHISWAP_V3,
  )

  const [
    constantProductReserves,
    stableReserves,
    concentratedLiquidityReserves,
    v3Info,
  ] = await Promise.all([
    getConstantProductPoolReserves(constantProductPoolIds, blockNumber),
    getStablePoolReserves(stablePoolIds, blockNumber),
    getConcentratedLiquidityPoolReserves(
      concentratedLiquidityPools,
      blockNumber,
    ),
    fetchV3Info(concentratedLiquidityPools, chainId, blockNumber),
  ])
  const poolsWithReserves = new Map([
    ...constantProductReserves,
    ...stableReserves,
    ...concentratedLiquidityReserves,
  ])
  let classicCount = 0
  let stableCount = 0
  let clCount = 0
  const rPools: RPool[] = []
  pools.forEach((pool) => {
    const reserves = poolsWithReserves.get(pool.id)
    if (!reserves) return
    const token0 = {
      address: pool.token0.address,
      name: pool.token0.name,
      symbol: pool.token0.symbol,
      decimals: pool.token0.decimals,
    }
    const token1 = {
      address: pool.token1.address,
      name: pool.token1.name,
      symbol: pool.token1.symbol,
      decimals: pool.token1.decimals,
    }
    if (!tokens.has(token0.address)) tokens.set(token0.address, pool.token0)
    if (!tokens.has(token1.address)) tokens.set(token1.address, pool.token1)
    if (
      pool.protocol === Protocol.BENTOBOX_CLASSIC ||
      pool.protocol === Protocol.SUSHISWAP_V2
    ) {
      rPools.push(
        new ConstantProductRPool(
          pool.address as Address,
          token0 as RToken,
          token1 as RToken,
          pool.swapFee,
          reserves.reserve0,
          reserves.reserve1,
        ),
      )
      classicCount++
    } else if (pool.protocol === Protocol.BENTOBOX_STABLE) {
      const total0 = rebases?.get(token0.address)
      const total1 = rebases?.get(token1.address)
      if (total0 && total1) {
        rPools.push(
          new StableSwapRPool(
            pool.address as Address,
            token0 as RToken,
            token1 as RToken,
            pool.swapFee,
            toShareBI(reserves.reserve0, total0),
            toShareBI(reserves.reserve1, total1),
            pool.token0.decimals,
            pool.token1.decimals,
            total0,
            total1,
          ),
        )
        stableCount++
      }
    } else if (pool.protocol === Protocol.SUSHISWAP_V3) {
      const v3 = v3Info.get(pool.address)
      const tickSpacing = TICK_SPACINGS[pool.swapFee * 1_000_000]
      if (v3 && tickSpacing) {
        rPools.push(
          new CLRPool(
            pool.address as Address,
            token0 as RToken,
            token1 as RToken,
            pool.swapFee,
            tickSpacing,
            reserves.reserve0,
            reserves.reserve1,
            v3.liquidity,
            v3.sqrtPriceX96,
            v3.tick,
            [],
          ),
        )
        clCount++
      }
    }
  })
  console.log(
    `Transformed ${rPools.length} pools and ${tokens.size} tokens. Classic: ${classicCount}, Stable: ${stableCount}, CL: ${clCount}`,
  )
  return { rPools, tokens }
}

async function fetchRebases(
  pools: Pool[],
  chainId: BentoBoxChainId,
  blockNumber: bigint,
) {
  const sortedTokens = poolsToUniqueTokens(pools)

  const totals = await readContracts({
    allowFailure: true,
    contracts: sortedTokens.map(
      (t) =>
        ({
          args: [t.address as Address],
          address: BENTOBOX_ADDRESS[chainId],
          chainId: chainId,
          abi: totalsAbi,
          functionName: 'totals',
        }) as const,
    ),
    blockNumber,
  })

  const rebases: Map<string, Rebase> = new Map()
  sortedTokens.forEach((t, i) => {
    const total = totals[i].result
    if (!total) return
    rebases.set(t.address, { base: total[0], elastic: total[1] })
  })
  return rebases
}

async function fetchV3Info(
  pools: Pool[],
  chainId: ChainId,
  blockNumber: bigint,
) {
  const [slot0, liquidity] = await Promise.all([
    readContracts({
      allowFailure: true,
      contracts: pools.map(
        (pool) =>
          ({
            address: pool.address as Address,
            chainId,
            abi: [
              {
                inputs: [],
                name: 'slot0',
                outputs: [
                  {
                    internalType: 'uint160',
                    name: 'sqrtPriceX96',
                    type: 'uint160',
                  },
                  { internalType: 'int24', name: 'tick', type: 'int24' },
                  {
                    internalType: 'uint16',
                    name: 'observationIndex',
                    type: 'uint16',
                  },
                  {
                    internalType: 'uint16',
                    name: 'observationCardinality',
                    type: 'uint16',
                  },
                  {
                    internalType: 'uint16',
                    name: 'observationCardinalityNext',
                    type: 'uint16',
                  },
                  { internalType: 'uint8', name: 'feeProtocol', type: 'uint8' },
                  { internalType: 'bool', name: 'unlocked', type: 'bool' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'slot0',
            blockNumber,
          }) as const,
      ),
    }),
    readContracts({
      allowFailure: true,
      contracts: pools.map(
        (p) =>
          ({
            address: p.address as Address,
            chainId: chainId,
            abi: [
              {
                inputs: [],
                name: 'liquidity',
                outputs: [
                  { internalType: 'uint128', name: '', type: 'uint128' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'liquidity',
            blockNumber,
          }) as const,
      ),
    }),
  ])
  const poolInfo: Map<string, V3PoolInfo> = new Map()
  pools.forEach((pool, i) => {
    const _slot0 = slot0[i].result
    const _liquidity = liquidity[i].result
    if (_slot0 && _liquidity) {
      const [
        sqrtPriceX96,
        tick,
        observationIndex,
        observationCardinality,
        observationCardinalityNext,
        feeProtocol,
        unlocked,
      ] = _slot0

      poolInfo.set(pool.address, {
        address: pool.address,
        liquidity: _liquidity,
        sqrtPriceX96: sqrtPriceX96,
        tick: tick,
        observationIndex: observationIndex,
        observationCardinality: observationCardinality,
        observationCardinalityNext: observationCardinalityNext,
        feeProtocol: feeProtocol,
        unlocked: unlocked,
      })
    }
  })

  return poolInfo
}

function poolsToUniqueTokens(pools: Pool[]) {
  const tokenMap = new Map<string, Token>()
  pools.forEach((pool) => {
    tokenMap.set(pool.token0.address, pool.token0)
    tokenMap.set(pool.token1.address, pool.token1)
  })
  const tokensDedup = Array.from(tokenMap.values())
  const tok0: [string, Token][] = tokensDedup.map((t) => [
    t.address.toLocaleLowerCase().substring(2).padStart(40, '0'),
    t,
  ])
  return tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)
}

function calculatePrices(
  pools: RPool[],
  minimumLiquidity: number | undefined,
  baseToken: {
    symbol: string
    address: string
    name: string
    decimals: number
  },
  tokens: Map<string, Token>,
) {
  const startTime = performance.now()
  const results = calcTokenPrices(pools, baseToken, minimumLiquidity)
  const endTime = performance.now()
  console.log(
    `calcTokenPrices() found ${results.size} prices (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s). `,
  )

  const tokensWithPrices = []

  for (const [rToken, value] of results.entries()) {
    const token = tokens.get(rToken.address)
    if (!token) {
      console.log(
        `Token not found: ${rToken.symbol}~${rToken.address}~${value}`,
      )
      continue
    }
    if (value === 0) {
      console.log(`Price null: ${rToken.symbol}~${rToken.address}~${value}`)
    }

    const price = Number(
      (value / 10 ** (baseToken.decimals - token.decimals)).toFixed(12),
    )
    if (price > Number.MAX_SAFE_INTEGER) continue
    // console.log(`${token.symbol}~${token.address}~${price}`)
    tokensWithPrices.push({ id: token.id, price })
  }

  return tokensWithPrices
}

async function updateTokenPrices(
  client: PrismaClient,
  price: Price,
  tokens: { id: string; price: number }[],
) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const requests = batch.map((token) => {
      const data =
        price === Price.USD
          ? { derivedUSD: token.price }
          : { derivedETH: token.price }
      return client.token.update({
        select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
        where: { id: token.id },
        data,
      })
    })
    const responses = await Promise.all(requests)
    console.log(`BATCH: Updated ${responses.length} prices.`)
    updatedCount += responses.length
  }
  const endTime = performance.now()
  console.log(
    `Updated ${updatedCount} prices (${((endTime - startTime) / 1000).toFixed(
      1,
    )}s). `,
  )
}

interface Pool {
  id: string
  address: string
  chainId: number
  token0: Token
  token1: Token
  swapFee: number
  protocol: Protocol
}

interface V3PoolInfo {
  address: string
  liquidity: bigint
  sqrtPriceX96: bigint
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}
