import {
  ConstantProductRPool,
  RPool,
  type RToken,
  UniV3Pool,
  calcTokenPrices,
} from '@sushiswap/tines'
import { Address } from '@wagmi/core'
import { ExtractorSupportedChainId } from 'sushi/config'
import { STABLES, WNATIVE } from 'sushi/currency'
import { type TokenInfo } from 'sushi/token-list'
// import { isPromiseFulfilled } from 'sushi/validate'

export const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
  ETHEREUM: 'ETHEREUM',
  BITCOIN: 'BITCOIN',
} as const

export type Currency = typeof Currency[keyof typeof Currency]

interface Token {
  chainId: number
  decimals: number
  symbol: string
  name: string
  id: string
  isNative: boolean
  isToken: true
  address: string
  tokenId: string
}

interface Pool {
  address: string
  token0: Token
  token1: Token
  fee: number
  reserve0: string
  reserve1: string
  minLiquidity: number
  swapGasCost: number
  reserve0Number: bigint
  reserve1Number: bigint
  liquidity?: bigint
  sqrtPriceX96?: bigint
  nearestTick?: number
  ticks?: Tick[]
}
interface Tick {
  index: number
  DLiquidity: bigint
}

interface PoolCode {
  pool: Pool
  liquidityProvider: string
  poolName: string
}

async function fetchTokens(chainId: ExtractorSupportedChainId) {
  try {
    const result = await fetch(`https://tokens.sushi.com/v1/${chainId}`)
    const tokenList = (await result.json()) as TokenInfo[]
    return tokenList
  } catch (e) {
    console.log('Error fetching tokens')
    throw e
  }
}

async function fetchToken(chainId: ExtractorSupportedChainId, address: string) {
  try {
    const result = await fetch(
      `https://tokens.sushi.com/v1/${chainId}/${address}`,
    )
    const tokenList = (await result.json()) as TokenInfo | undefined
    return tokenList
  } catch (e) {
    console.log('Error fetching token')
    throw e
  }
}

async function fetchPoolCodes(chainId: number, address?: string) {
  try {
    const url = new URL('https://production.sushi.com/pool-codes')
    url.searchParams.set('chainId', chainId.toString())
    if (address) {
      url.searchParams.set('address', address)
    }
    const response = await fetch(url)
    const json = await response.json()
    return JSON.parse(json) as PoolCode[]
  } catch (e) {
    console.log('Error fetching pool codes')
    throw e
  }
}

async function fetchPoolCodesForToken(chainId: number, address: string) {
  try {
    const response = await fetch(
      `https://production.sushi.com/pool-codes-for-token?chainId=${chainId}&address=${address}`,
    )
    const json = await response.json()
    return JSON.parse(json) as PoolCode[]
  } catch (e) {
    console.log('Error fetching pool codes for token')
    throw e
  }
}

function mapPool(poolCode: PoolCode) {
  // Assumption, if all v3 fields are undefined, it's a v2 pool, otherwise v3. then we don't have to check the liquidity provider
  if (
    poolCode.pool.sqrtPriceX96 === undefined &&
    poolCode.pool.liquidity === undefined &&
    poolCode.pool.nearestTick === undefined &&
    poolCode.pool.ticks === undefined
  ) {
    return new ConstantProductRPool(
      poolCode.pool.address as `0x${string}`,
      poolCode.pool.token0 as RToken,
      poolCode.pool.token1 as RToken,
      poolCode.pool.fee,
      BigInt(poolCode.pool.reserve0),
      BigInt(poolCode.pool.reserve1),
    )
  } else if (
    poolCode.pool.nearestTick &&
    poolCode.pool.liquidity &&
    poolCode.pool.sqrtPriceX96 &&
    poolCode.pool.ticks
  ) {
    return new UniV3Pool(
      poolCode.pool.address as `0x${string}`,
      poolCode.pool.token0 as RToken,
      poolCode.pool.token1 as RToken,
      poolCode.pool.fee,
      BigInt(poolCode.pool.reserve0),
      BigInt(poolCode.pool.reserve1),
      poolCode.pool.nearestTick,
      poolCode.pool.liquidity,
      poolCode.pool.sqrtPriceX96,
      poolCode.pool.ticks,
    )
  }
  return undefined
}

function calculateTokenPrices(
  tokens: RToken[],
  bases: RToken[],
  pools: RPool[],
  minimumLiquidityUsd: number,
) {
  const prices: Map<string, Map<string, number>> = new Map()
  const bestPrices: Record<string, number> = {}

  bases.forEach((base) => {
    const currentPrices = calcTokenPrices(
      pools,
      base,
      minimumLiquidityUsd,
      // true,
    )
    // convert currentPrices to string,number map
    const currentPricesMap = new Map<string, number>()
    currentPrices.forEach((value, key) => {
      // if (key.address === base.address) return
      const price = Number(
        (value / 10 ** (base.decimals - key.decimals)).toFixed(18),
      )
      currentPricesMap.set(key.address, price)
    })
    prices.set(base.address, currentPricesMap)
  })
  for (const token of tokens) {
    const tokenPrices = Array.from(prices.keys())
      .map((t) => prices.get(t))
      .map((t) => t?.get(token.address))
      .filter(hasPrice)
    let price
    if (tokenPrices.length === 0) {
      price = 0
    } else if (tokenPrices.length === 1) {
      const single = tokenPrices[0]
      price = single
    } else if (tokenPrices.length === 2 && tokenPrices[0] && tokenPrices[1]) {
      const price1 = tokenPrices[0]
      const price2 = tokenPrices[1]
      const average = (price1 + price2) / 2
      price = average
    } else {
      const sortedPrices = tokenPrices.sort()
      const midIndex = Math.floor(sortedPrices.length / 2)
      const median1 = sortedPrices[midIndex - 1]
      const median2 = sortedPrices[midIndex]
      if (sortedPrices.length % 2 === 0 && median1 && median2) {
        const medianAverage = (median1 + median2) / 2
        price = medianAverage
      } else {
        const median = sortedPrices[midIndex]
        price = median
      }
    }
    if (price) {
      bestPrices[token.address] = price
    }
  }
  return bestPrices
}

export async function getPrices(chainId: number, currency: Currency) {
  if (
    currency === Currency.USD &&
    STABLES[chainId as keyof typeof STABLES] === undefined
  ) {
    throw new Error(`ChainId ${chainId} has no stables configured`)
  }

  const [tokens, poolCodes] = await Promise.all([
    fetchTokens(chainId as ExtractorSupportedChainId),
    fetchPoolCodes(chainId),
  ]) // The reason we fetch tokens here is to NOT send prices for every single token tines could price

  const mappedPools = poolCodes
    .map(mapPool)
    .filter((p) => p !== undefined) as RPool[]

  const bases =
    currency === Currency.USD
      ? (STABLES[chainId as keyof typeof STABLES] as unknown as RToken[])
      : ([WNATIVE[chainId as keyof typeof WNATIVE]] as unknown as RToken[])

  const prices = calculateTokenPrices(
    Array.from(tokens.values()),
    bases,
    mappedPools,
    1000,
  )

  return prices
}

const hasPrice = (input: number | undefined): input is number =>
  input !== undefined

/**
 * Get the price of a token
 * @param {number} chainId
 * @param {string} address
 * @param {Currency} currency
 * @returns {number | undefined}
 */
export async function getPrice(
  chainId: number,
  address: Address,
  currency: Currency = Currency.USD,
) {
  if (
    currency === Currency.USD &&
    STABLES[chainId as keyof typeof STABLES] === undefined
  ) {
    throw new Error(`ChainId ${chainId} has no stables configured`)
  }

  const [token, poolCodes] = await Promise.all([
    fetchToken(chainId as ExtractorSupportedChainId, address),
    fetchPoolCodesForToken(chainId, address),
  ])
  if (token === undefined) {
    return undefined
  }
  const mappedPools = poolCodes
    .map(mapPool)
    .filter((p) => p !== undefined) as RPool[]
  const bases =
    currency === Currency.USD
      ? (STABLES[chainId as keyof typeof STABLES] as unknown as RToken[])
      : ([WNATIVE[chainId as keyof typeof WNATIVE]] as unknown as RToken[])

  const prices = calculateTokenPrices([token], bases, mappedPools, 1000)
  return prices[token.address]
}
