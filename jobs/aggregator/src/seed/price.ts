/* eslint-disable turbo/no-undeclared-env-vars */
import { isAddress } from '@ethersproject/address'
import { totalsAbi } from '@sushiswap/abi'
import { BENTOBOX_ADDRESS, BentoBoxChainId, isBentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Prisma, PrismaClient, Token } from '@sushiswap/database'
import { calcTokenPrices, ConstantProductRPool, Rebase, RPool, RToken, StableSwapRPool } from '@sushiswap/tines'
import { Address, readContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'

import { PoolType, Price, ProtocolName, ProtocolVersion } from '../config.js'

const CURRENT_SUPPORTED_VERSIONS = [ProtocolVersion.V2, ProtocolVersion.LEGACY, ProtocolVersion.TRIDENT]

export async function prices(chainId: number, base: string, price: Price, minimumLiquidity = 500000000) {
  const client = new PrismaClient()
  try {
    if (!Object.values(Price).includes(price)) {
      throw new Error(`Price (${price}) not supported, supported price types: ${Object.values(Price).join(',')}`)
    }
    if (!isAddress(base)) {
      throw new Error(`${base} is not a valid address`)
    }

    const startTime = performance.now()

    console.log(`Arguments: CHAIN_ID: ${chainId}, BASE: ${base}, PRICE: ${price}`)

    const baseToken = await getBaseToken(client, chainId, base)
    const pools = await getPools(client, chainId)

    const { rPools, tokens } = await transform(chainId, pools)
    const tokensToUpdate = calculatePrices(rPools, minimumLiquidity, baseToken, tokens)
    await updateTokenPrices(client, price, tokensToUpdate)

    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function getBaseToken(client: PrismaClient, chainId: number, address: string) {
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

  if (!baseToken) throw new Error(`${baseToken} not found in database, check the address and chainId.`)
  return baseToken
}

async function getPools(client: PrismaClient, chainId: number) {
  const startTime = performance.now()

  const batchSize = 2500
  let cursor = null
  const results = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsByPagination(client, chainId, batchSize)
    } else {
      result = await getPoolsByPagination(client, chainId, batchSize, 1, { id: cursor })
    }

    cursor = result.length === batchSize ? result[result.length - 1]?.id : null
    totalCount += result.length
    results.push(result)
    const requestEndTime = performance.now()
    console.log(
      `Fetched a batch of pools with ${result.length} (${((requestEndTime - requestStartTime) / 1000).toFixed(
        1
      )}s). cursor: ${cursor}, total: ${totalCount}`
    )
  } while (cursor != null)
  const endTime = performance.now()
  const flatResult = results.flat()

  console.log(`Fetched ${flatResult.length} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return flatResult
}

async function getPoolsByPagination(
  client: PrismaClient,
  chainId: number,
  take: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
): Promise<Pool[]> {
  return client.pool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
      address: true,
      token0: true,
      token1: true,
      swapFee: true,
      type: true,
      reserve0: true,
      reserve1: true,
    },
    where: {
      OR: [
        {
          isWhitelisted: true,
          chainId,
          type: { in: [PoolType.CONSTANT_PRODUCT_POOL, PoolType.STABLE_POOL] },
          version: {
            in: CURRENT_SUPPORTED_VERSIONS,
          },
        },
        {
          chainId,
          protocol: ProtocolName.SUSHISWAP,
          type: { in: [PoolType.CONSTANT_PRODUCT_POOL, PoolType.STABLE_POOL] },
          version: {
            in: CURRENT_SUPPORTED_VERSIONS,
          },
        },
      ],
    },
  })
}

async function transform(chainId: number, pools: Pool[]) {
  const tokens: Map<string, Token> = new Map()
  const stablePools = pools.filter((pool) => pool.type === PoolType.STABLE_POOL)
  const rebases = isBentoBoxChainId(chainId as BentoBoxChainId)
    ? await fetchRebases(stablePools, chainId as BentoBoxChainId)
    : undefined

  const rPools: RPool[] = []
  pools.forEach((pool) => {
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
    if (pool.type === PoolType.CONSTANT_PRODUCT_POOL) {
      rPools.push(
        new ConstantProductRPool(
          pool.address as Address,
          token0 as RToken,
          token1 as RToken,
          pool.swapFee,
          BigInt(pool.reserve0),
          BigInt(pool.reserve1)
        )
      )
    } else if (pool.type === PoolType.STABLE_POOL) {
      const total0 = rebases?.get(token0.address)
      const total1 = rebases?.get(token1.address)
      if (total0 && total1) {
        rPools.push(
          new StableSwapRPool(
            pool.address as Address,
            token0 as RToken,
            token1 as RToken,
            pool.swapFee,
            BigInt(pool.reserve0),
            BigInt(pool.reserve1),
            pool.token0.decimals,
            pool.token1.decimals,
            total0,
            total1
          )
        )
      }
    }
  })
  return { rPools, tokens }
}

async function fetchRebases(pools: Pool[], chainId: BentoBoxChainId) {
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
  const sortedTokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([, t]) => t)

  const totals = await readContracts({
    allowFailure: true,
    contracts: sortedTokens.map(
      (t) =>
        ({
          args: [t.address as Address],
          address: BENTOBOX_ADDRESS[chainId],
          chainId,
          abi: totalsAbi,
          functionName: 'totals',
        } as const)
    ),
  })

  const rebases: Map<string, Rebase> = new Map()
  sortedTokens.forEach((t, i) => {
    if (totals[i].error) return
    const [elastic, base] = totals[i].result
    rebases.set(t.address, { elastic, base })
  })
  return rebases
}

function calculatePrices(
  pools: RPool[],
  minimumLiquidity: number | undefined,
  baseToken: { symbol: string; address: string; name: string; decimals: number },
  tokens: Map<string, Token>
) {
  const startTime = performance.now()
  const results = calcTokenPrices(pools, baseToken, minimumLiquidity)
  const endTime = performance.now()
  console.log(`calcTokenPrices() found ${results.size} prices (${((endTime - startTime) / 1000).toFixed(1)}s). `)

  const tokensWithPrices = []

  for (const [rToken, value] of results.entries()) {
    const token = tokens.get(rToken.address)
    if (!token) {
      console.log(`Token not found: ${rToken.symbol}~${rToken.address}~${value}`)
      continue
    }
    if (value === 0) {
      console.log(`Price null: ${rToken.symbol}~${rToken.address}~${value}`)
    }

    const price = Number((value / 10 ** (baseToken.decimals - token.decimals)).toFixed(12))
    if (price > Number.MAX_SAFE_INTEGER) continue
    // console.log(`${token.symbol}~${token.address}~${price}`)
    tokensWithPrices.push({ id: token.id, price })
  }

  return tokensWithPrices
}

async function updateTokenPrices(client: PrismaClient, price: Price, tokens: { id: string; price: number }[]) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const requests = batch.map((token) => {
      const data = price === Price.USD ? { derivedUSD: token.price } : { derivedETH: token.price }
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
  console.log(`Updated ${updatedCount} prices (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface Pool {
  id: string
  address: string
  type: string
  token0: Token
  token1: Token
  swapFee: number
  reserve0: string
  reserve1: string
}
