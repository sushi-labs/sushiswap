import { Token } from '@sushiswap/currency'
import fetch from 'node-fetch'

interface PoolResponse {
  address: string
  token0: {
    address: string
    decimals: number
    symbol: string
    name: string
  }
  token1: {
    address: string
    decimals: number
    symbol: string
    name: string
  }
}

/**
 * Get all pools including the tokens provided, where the other token in the pair is approved.
 * @param chainId
 * @param protocol
 * @param version
 * @param poolType
 * @param token0Address
 * @param token1Address
 * @returns
 */
export async function getPoolsByTokenIds(
  chainId: number,
  protocol: string,
  version: string,
  poolType: string,
  token0Address: string,
  token1Address: string,
  excludeTopPoolsSize: number,
  size: number
) {
  try {
    const pools = await fetch(
      `http://localhost:3000/api/v0/aggregator/pools/${chainId}/${protocol}/${version}/${poolType}?token0=${token0Address}&token1=${token1Address}&size=${size}&excludeTopPoolsSize=${excludeTopPoolsSize}`
    ).then((data) => data.json() as Promise<PoolResponse[]>)

    const poolMap: Map<string, [Token, Token]> = new Map()
    for (const pool of pools) {
      const token0 = new Token({
        chainId,
        address: pool.token0.address,
        decimals: pool.token0.decimals,
        symbol: pool.token0.symbol,
        name: pool.token0.name,
      })
      const token1 = new Token({
        chainId,
        address: pool.token1.address,
        decimals: pool.token1.decimals,
        symbol: pool.token1.symbol,
        name: pool.token1.name,
      })
      poolMap.set(pool.address, [token0, token1])
    }

    return poolMap
  } catch (error) {
    console.error(error)
    return new Map<string, [Token, Token]>()
  }
}

/**
 * Get top pools
 * @param chainId
 * @param protocol
 * @param version
 * @param poolType
 * @param size
 * @returns
 */
export async function getTopPools(chainId: number, protocol: string, version: string, poolType: string, size: number) {
  try {
    const pools = await fetch(
      `http://localhost:3000/api/v0/aggregator/top-pools/${chainId}/${protocol}/${version}/${poolType}?size=${size}`
    ).then((data) => data.json() as Promise<PoolResponse[]>)
    const poolMap: Map<string, [Token, Token]> = new Map()

    for (const pool of pools) {
      const token0 = new Token({
        chainId,
        address: pool.token0.address,
        decimals: pool.token0.decimals,
        symbol: pool.token0.symbol,
        name: pool.token0.name,
      })
      const token1 = new Token({
        chainId,
        address: pool.token1.address,
        decimals: pool.token1.decimals,
        symbol: pool.token1.symbol,
        name: pool.token1.name,
      })
      poolMap.set(pool.address, [token0, token1])
    }

    return poolMap
  } catch (error) {
    console.error(error)
    return new Map<string, [Token, Token]>()
  }
}
