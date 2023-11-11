import {
  ConstantProductRPool,
  RPool,
  type RToken,
  UniV3Pool,
  calcTokenPrices,
} from '@sushiswap/tines'
import { deserialize } from '@wagmi/core'
import { STABLES, WNATIVE } from 'sushi/currency'
import {
  DEFAULT_LIST_OF_LISTS,
  type TokenInfo,
  type TokenList,
} from 'sushi/token-list'
// import { isPromiseFulfilled } from 'sushi/validate'
import { getAddress } from 'viem'
import redis from '../redis.js'

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

const REDIS_KEY_PREFIX = "token-list-v2-";

async function fetchTokensFromLists() {
	const promises: Promise<TokenList>[] = [];

	for (const url of DEFAULT_LIST_OF_LISTS) {
		const key = `${REDIS_KEY_PREFIX}-${url}`.toLowerCase();
		const cached = await redis.get(key);
		if (cached) {
			promises.push(Promise.resolve(JSON.parse(cached)));
		}
	}

	return Promise.all(promises).then((tokenLists) => {
		return tokenLists.flatMap((tokenList) =>
			tokenList.tokens.map((t) => ({
				...(t as TokenInfo),
				// Token addresses are sometimes lowercase from token lists
				address: getAddress(t.address),
			})),
		);
	});
}

async function fetchPoolCodes(chainId: number, address?: string) {
  const url = new URL('https://swap.sushi.com/pool-codes')
  url.searchParams.set('chainId', chainId.toString())
  if (address) {
    url.searchParams.set('address', address)
  }
  const response = await fetch(url)
  const json = await response.json()
  return deserialize(json) as PoolCode[]
}

async function fetchPoolCodesForToken(chainId: number, address: string) {
  const response = await fetch(
    `https://swap.sushi.com/pool-codes-for-token?chainId=${chainId}&address=${address}`,
  )
  const json = await response.json()
  return deserialize(json) as PoolCode[]
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
  const [tokensFromLists, poolCodes] = await Promise.all([
    fetchTokensFromLists(),
    fetchPoolCodes(chainId),
  ])
  const tokens = new Map<string, TokenInfo>()
  tokensFromLists
    .filter((t) => t.chainId === chainId)
    .forEach((t) => {
      if (!tokens.has(t.address.toLowerCase())) {
        // first tokens should be sushis, we don't override them in case we have changed name/symbols
        tokens.set(t.address.toLowerCase(), t)
      }
    })

  const filteredPoolCodes = poolCodes.filter(
    (pc) =>
      tokens.has(pc.pool.token0.address.toLowerCase()) &&
      tokens.has(pc.pool.token1.address.toLowerCase()),
  )

  const mappedPools = filteredPoolCodes
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
 * @returns {number}
 */
export async function getPrice(
  chainId: number,
  address: string,
  currency: Currency = Currency.USD,
) {
  if (
    currency === Currency.USD &&
    STABLES[chainId as keyof typeof STABLES] === undefined
  ) {
    throw new Error(`ChainId ${chainId} has no stables configured`)
  }
  const [tokensFromLists, poolCodes] = await Promise.all([
    fetchTokensFromLists(),
    fetchPoolCodesForToken(chainId, address),
  ])
  const tokens = new Map<string, TokenInfo>()
  tokensFromLists
    .filter((t) => t.chainId === chainId)
    .forEach((t) => {
      if (!tokens.has(t.address.toLowerCase())) {
        // first tokens should be sushis, we don't override them in case we have changed name/symbols
        tokens.set(t.address.toLowerCase(), t)
      }
    })

  const filteredPoolCodes = poolCodes.filter(
    (pc) =>
      tokens.has(pc.pool.token0.address.toLowerCase()) &&
      tokens.has(pc.pool.token1.address.toLowerCase()),
  )
  const mappedPools = filteredPoolCodes
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
  return prices[address]
}
