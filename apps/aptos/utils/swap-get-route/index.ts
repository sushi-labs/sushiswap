import { SupportedNetwork, chains } from 'config/chains'
import { baseTokens } from '../baseTokens'
import { Token } from '../tokenType'
import { Pool } from '../usePools'
import { getBestRoute } from './get-best-route'
import { PoolInfo, PoolReserve, Vertex } from './types'

interface GetSwapRoute {
  amountIn?: number
  tokenIn: Token
  tokenOut: Token
  pools: Pool[]
  network: SupportedNetwork
}

export async function getSwapRoute({
  amountIn = 0,
  tokenIn,
  tokenOut,
  pools,
  network,
}: GetSwapRoute) {
  const {
    api: { fetchUrlPrefix },
    contracts: { swap: swapContract },
  } = chains[network]

  const tokens = pools.reduce<Set<string>>(
    (acc, pool) => {
      acc.add(pool.data.token_x_details.token_address)
      acc.add(pool.data.token_y_details.token_address)
      return acc
    },
    new Set([...baseTokens, tokenIn.address, tokenOut.address]),
  )
  const tokenArray = [...tokens]

  const allTokenPairs: [string, string][] = []

  for (let i = 0; i < tokenArray.length; i++) {
    for (let j = i + 1; j < tokenArray.length; j++) {
      allTokenPairs.push([tokenArray[i], tokenArray[j]])
    }
  }

  const data: { data: any; type: string }[] | { error_code: any } = await fetch(
    `${fetchUrlPrefix}/v1/accounts/${swapContract}/resources`,
  ).then((res) => res.json())

  if ('error_code' in data) {
    throw new Error(`Failed to fetch swap resources: ${data?.error_code}`)
  }

  const poolReserves = new Map<string, PoolReserve>()
  const poolInfos = new Map<string, PoolInfo>()

  data.forEach((d) => {
    if (d.type.includes('TokenPairReserve')) {
      poolReserves.set(d.type, d)
    }
    if (d.type.includes('LPToken')) {
      poolInfos.set(d.type, d)
    }
  })

  const vertices = new Map<string, Vertex>()
  allTokenPairs.forEach(([token0, token1]) => {
    if (
      poolReserves.has(
        `${swapContract}::swap::TokenPairReserve<${token0}, ${token1}>`,
      )
    ) {
      const info = poolInfos.get(
        `0x1::coin::CoinInfo<${swapContract}::swap::LPToken<${token0}, ${token1}>>`,
      )!
      const data = poolReserves.get(
        `${swapContract}::swap::TokenPairReserve<${token0}, ${token1}>`,
      )!

      vertices.set(`${token0}|||${token1}`, {
        pair: `${token0}|||${token1}`,
        res_x: Number(data.data.reserve_x),
        res_y: Number(data.data.reserve_y),
        lpTokenInfo: info,
        ...data,
      })

      return
    }

    if (
      poolReserves.has(
        `${swapContract}::swap::TokenPairReserve<${token1}, ${token0}>`,
      )
    ) {
      const info = poolInfos.get(
        `0x1::coin::CoinInfo<${swapContract}::swap::LPToken<${token1}, ${token0}>>`,
      )!
      const data = poolReserves.get(
        `${swapContract}::swap::TokenPairReserve<${token1}, ${token0}>`,
      )!

      vertices.set(`${token1}|||${token0}`, {
        pair: `${token0}|||${token1}`,
        res_x: Number(data.data.reserve_x),
        res_y: Number(data.data.reserve_y),
        lpTokenInfo: info,
        ...data,
      })
    }
  })

  const graph = new Map<string, string[]>()
  vertices.forEach((vertex) => {
    const coins_data = vertex.pair.split('|||')

    if (graph.has(coins_data[0])) {
      graph.get(coins_data[0])!.push(coins_data[1])
    } else {
      graph.set(coins_data[0], [coins_data[1]])
    }

    if (graph.has(coins_data[1])) {
      graph.get(coins_data[1])!.push(coins_data[0])
    } else {
      graph.set(coins_data[1], [coins_data[0]])
    }

    return data
  }, {})

  const bestRoute = getBestRoute({
    amountIn,
    vertices,
    tokenGraph: graph,
    tokenIn,
    tokenOut,
  })

  return bestRoute
}
