import { Token } from '@sushiswap/currency'
import { PrismaClient } from '@sushiswap/database'

import { getPoolsByTokenIds, getTopPools as getTopPoolsFromDb } from './database'

export interface PoolResponse {
  address: string
  type: string
  swapFee: number
  twapEnabled: boolean
  token0: Token
  token1: Token
}

export async function getOnDemandPools(
  client: PrismaClient,
  chainId: number,
  protocol: string,
  version: string,
  poolTypes: ('CONSTANT_PRODUCT_POOL' | 'CONCENTRATED_LIQUIDITY_POOL' | 'STABLE_POOL')[],
  token0: string,
  token1: string,
  excludeTopPoolsSize: number,
  topPoolMinLiquidity: number,
  take: number
) {
  try {
    const pools = await getPoolsByTokenIds(client, {
      chainId,
      protocol,
      version,
      poolTypes,
      token0,
      token1,
      excludeTopPoolsSize,
      topPoolMinLiquidity,
      take,
    })

    const poolMap: Map<string, PoolResponse> = new Map()
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
      poolMap.set(pool.address, {
        address: pool.address,
        swapFee: pool.swapFee,
        twapEnabled: pool.twapEnabled,
        type: pool.type,
        token0,
        token1,
      })
    }

    return poolMap
  } catch (error: any) {
    console.error(error.message)
    return new Map<string, PoolResponse>()
  }
}

export async function getTopPools(
  client: PrismaClient,
  chainId: number,
  protocol: string,
  version: string,
  poolTypes: ('CONSTANT_PRODUCT_POOL' | 'CONCENTRATED_LIQUIDITY_POOL' | 'STABLE_POOL')[],
  take: number,
  minLiquidity: number
) {
  try {
    const pools = await getTopPoolsFromDb(client, { chainId, protocol, version, poolTypes, take, minLiquidity })
    const poolMap: Map<string, PoolResponse> = new Map()

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
      poolMap.set(pool.address, {
        address: pool.address,
        swapFee: pool.swapFee,
        twapEnabled: pool.twapEnabled,
        type: pool.type,
        token0,
        token1,
      })
    }

    return poolMap
  } catch (error: any) {
    console.error(error.message)
    return new Map<string, PoolResponse>()
  }
}
