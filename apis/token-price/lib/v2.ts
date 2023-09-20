import { STABLES } from '@sushiswap/currency'
import { calcTokenPrices,ConstantProductRPool, RPool, type RToken, UniV3Pool } from '@sushiswap/tines'
import { fetch } from '@whatwg-node/fetch'

interface TokenResponse {
  address: string
  chainId: number
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

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

async function fetchTokens() {
  const responses = await Promise.all([
    fetch('https://token-list.sushi.com'),
    fetch('https://bridge.arbitrum.io/token-list-42161.json'),
  ])
  const json = await Promise.all(responses.map((r) => r.json()))
  return [...json[0].tokens, ...json[1].tokens] as TokenResponse[]
}

async function fetchPoolCodes(chainId: number) {
  const response = await fetch(`https://swap.sushi.com/pool-codes?chainId=${chainId}`)
  const jsonString = await response.json()
  const preprocessedString = jsonString.replace(/"#bigint\.(-?\d+(\.\d+)?)"/g, '"$1"')
  return JSON.parse(preprocessedString) as PoolCode[]
}

function mapPool(poolCode: PoolCode) {
  if (['SushiSwapV2'.toLowerCase(), 'UniswapV2'.toLowerCase()].includes(poolCode.liquidityProvider.toLowerCase())) {
    return new ConstantProductRPool(
      poolCode.pool.address as `0x${string}`,
      poolCode.pool.token0 as RToken,
      poolCode.pool.token1 as RToken,
      poolCode.pool.fee,
      BigInt(poolCode.pool.reserve0),
      BigInt(poolCode.pool.reserve1)
    )
  } else if (
    ['SushiSwapV3'.toLowerCase(), 'UniswapV3'.toLowerCase()].includes(poolCode.liquidityProvider.toLowerCase()) &&
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
      poolCode.pool.ticks
    )
  }
  return undefined
}

function calculateTokenPrices(tokens: RToken[], bases: RToken[], pools: RPool[], minimumLiquidityUsd: number) {
  const prices: Map<string, Map<string, number>> = new Map()
  const bestPrices: Record<string, number> = {}
  bases.forEach((base) => {
    const currentPrices = calcTokenPrices(pools, base, minimumLiquidityUsd)
    // convert currentPrices to string,number map
    const currentPricesMap = new Map<string, number>()
    currentPrices.forEach((value, key) => {
      if (key.address === base.address) return
      const price = Number((value / 10 ** (base.decimals - key.decimals)).toFixed(18))
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

export async function getPrices(chainId: number) {
  if (STABLES[chainId as keyof typeof STABLES] === undefined) {
    throw new Error(`ChainId ${chainId} has no stables configured`)
  }
  const [tokens, poolCodes] = await Promise.all([fetchTokens(), fetchPoolCodes(chainId)])
  const tokenMap = new Map<string, TokenResponse>()
  tokens
    .filter((t) => t.chainId === chainId)
    .forEach((t) => {
      if (!tokenMap.get(t.address.toLowerCase())) {
        // first tokens should be sushis, we don't override them in case we have changed name/symbols
        tokenMap.set(t.address.toLowerCase(), t)
      }
    })
  console.log(`Found ${tokens.length} tokens, filtered it down to ${tokenMap.size}`)

  const filteredPoolCodes = poolCodes.filter(
    (pc) => tokenMap.has(pc.pool.token0.address.toLowerCase()) && tokenMap.has(pc.pool.token1.address.toLowerCase())
  )
  console.log(`Found ${poolCodes.length} pools, filtered it down to ${filteredPoolCodes.length}`)
  const mappedPools = filteredPoolCodes.map(mapPool).filter((p) => p !== undefined) as RPool[]
  const bases = STABLES[chainId as keyof typeof STABLES] as unknown as RToken[]
  return calculateTokenPrices(tokens, bases, mappedPools, 1000)
}

const hasPrice = (input: number | undefined): input is number => input !== undefined
