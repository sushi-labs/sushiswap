/* eslint-disable turbo/no-undeclared-env-vars */
import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/chain'
import { client,Prisma, Token } from '@sushiswap/database'
import { calcTokenPrices, ConstantProductRPool } from '@sushiswap/tines'
import { performance } from 'perf_hooks'

import { PoolType, Price, ProtocolVersion } from '../config.js'

const CURRENT_SUPPORTED_VERSIONS = [ProtocolVersion.V2, ProtocolVersion.LEGACY, ProtocolVersion.TRIDENT]

export async function prices(
  chainId: ChainId,
  version: ProtocolVersion,
  type: PoolType,
  base: string,
  price: Price,
  minimumLiquidity = 500000000
) {
  try {
    if (!Object.values(CURRENT_SUPPORTED_VERSIONS).includes(version)) {
      throw new Error(
        `Protocol version (${version}) not supported, supported versions: ${CURRENT_SUPPORTED_VERSIONS.join(',')}`
      )
    }
    if (type !== PoolType.CONSTANT_PRODUCT_POOL) {
      throw new Error(`Pool type ${type} not supported, supported types: ${PoolType.CONSTANT_PRODUCT_POOL}`)
    }

    if (!Object.values(Price).includes(price)) {
      throw new Error(`Price (${price}) not supported, supported price types: ${Object.values(Price).join(',')}`)
    }
    if (!isAddress(base)) {
      throw new Error(`${base} is not a valid address`)
    }

    const startTime = performance.now()

    console.log(`Arguments: CHAIN_ID: ${chainId}, VERSION: ${version}, TYPE: ${type}, BASE: ${base}, PRICE: ${price}`)

    const baseToken = await getBaseToken(chainId, base)
    const pools = await getPools(chainId)

    const { constantProductPools, tokens } = transform(pools)
    const tokensToUpdate = calculatePrices(constantProductPools, minimumLiquidity, baseToken, tokens)
    await updateTokenPrices(price, tokensToUpdate)

    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function getBaseToken(chainId: ChainId, address: string) {
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

async function getPools(chainId: ChainId) {
  const startTime = performance.now()

  const batchSize = 2500
  let cursor = null
  const results = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsByPagination(chainId, batchSize)
    } else {
      result = await getPoolsByPagination(chainId, batchSize, 1, { id: cursor })
    }
    cursor = result.length == batchSize ? result[result.length - 1].id : null
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
  chainId: ChainId,
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
      isWhitelisted: true,
      chainId,
      type: PoolType.CONSTANT_PRODUCT_POOL,
      version: {
        in: CURRENT_SUPPORTED_VERSIONS,
      },
    },
  })
}

function transform(pools: Pool[]) {
  const tokens: Map<string, Token> = new Map()
  const constantProductPools: ConstantProductRPool[] = []
  pools.forEach((pool) => {
    const token0 = {
      address: pool.token0.address,
      name: pool.token0.name,
      symbol: pool.token0.symbol,
    }
    const token1 = {
      address: pool.token1.address,
      name: pool.token1.name,
      symbol: pool.token1.symbol,
    }
    if (!tokens.has(token0.address)) tokens.set(token0.address, pool.token0)
    if (!tokens.has(token1.address)) tokens.set(token1.address, pool.token1)

    constantProductPools.push(
      new ConstantProductRPool(
        pool.address,
        token0,
        token1,
        pool.swapFee,
        BigNumber.from(pool.reserve0),
        BigNumber.from(pool.reserve1)
      )
    )
  })
  return { constantProductPools, tokens }
}

function calculatePrices(
  constantProductPools: ConstantProductRPool[],
  minimumLiquidity: number | undefined,
  baseToken: { symbol: string; address: string; name: string; decimals: number },
  tokens: Map<string, Token>
) {
  const startTime = performance.now()
  const results = calcTokenPrices(constantProductPools, baseToken, minimumLiquidity)
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

    const price = Number((value / Math.pow(10, baseToken.decimals - token.decimals)).toFixed(12))
    if (price > Number.MAX_SAFE_INTEGER) continue
    // console.log(`${token.symbol}~${token.address}~${price}`)
    tokensWithPrices.push({ id: token.id, price })
  }

  return tokensWithPrices
}

async function updateTokenPrices(price: Price, tokens: { id: string; price: number }[]) {
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
