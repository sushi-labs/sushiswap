import { Token } from '@sushiswap/currency'
import fetch from 'node-fetch'

export interface PoolResponse {
  address: string
  type: string,
  swapFee: number
  twapEnabled: boolean
  token0: Token
  token1: Token
}

export async function getPoolsByTokenIds(
  chainId: number,
  protocol: string,
  version: string,
  poolTypes: ('CONSTANT_PRODUCT_POOL' | 'CONCENTRATED_LIQUIDITY_POOL' | 'STABLE_POOL')[],
  token0Address: string,
  token1Address: string,
  excludeTopPoolsSize: number,
  topPoolMinLiquidity: number,
  size: number
) {
  try {
    const pools = await fetch(
     `https://pools-git-feature-swap.sushi.com/api/v0/aggregator/pools/${chainId}/${protocol}/${version}?poolTypes=${poolTypes.join(',')}&token0=${token0Address}&token1=${token1Address}&take=${size}&excludeTopPoolsSize=${excludeTopPoolsSize}&topPoolMinLiquidity=${topPoolMinLiquidity}`
      ).then((data) => data.json()).catch((e: any) => {
        console.log(e.message)
        return new Map<string, PoolResponse>()
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
  chainId: number,
  protocol: string,
  version: string,
  poolTypes: ('CONSTANT_PRODUCT_POOL' | 'CONCENTRATED_LIQUIDITY_POOL' | 'STABLE_POOL')[],
  size: number,
  minLiquidity: number
) {
  try {
    const pools = await fetch(
      `https://pools-git-feature-swap.sushi.com/api/v0/aggregator/top-pools/${chainId}/${protocol}/${version}?poolTypes=${poolTypes.join(',')}&take=${size}&minLiquidity=${minLiquidity}`
        ).then((data) => data.json())
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
