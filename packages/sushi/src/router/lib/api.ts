import { Address } from 'viem'
import { Token } from '../../currency/index.js'

export interface PoolResponse2 {
  type: string
  address: Address
  twapEnabled: boolean
  swapFee: number
  liquidityUSD: string
  isWhitelisted: true
  token0: {
    symbol: string
    address: Address
    status: string
    id: string
    name: string
    decimals: number
    isFeeOnTransfer: boolean
    isCommon: boolean
  }
  token1: {
    symbol: string
    address: Address
    status: string
    id: string
    name: string
    decimals: number
    isFeeOnTransfer: boolean
    isCommon: boolean
  }
}

export function filterOnDemandPools(
  pools: PoolResponse2[],
  token0Address: string,
  token1Address: string,
  topPoolAddresses: string[],
  size: number,
) {
  let token0PoolSize = 0
  let token1PoolSize = 0
  const token0Pools = pools.filter(
    (p) =>
      (p.token0.address === token0Address.toLowerCase() &&
        !p.token1.isFeeOnTransfer &&
        p.token1.status === 'APPROVED') ||
      (p.token1.address === token0Address.toLowerCase() &&
        !p.token0.isFeeOnTransfer &&
        p.token0.status === 'APPROVED'),
  )
  const token1Pools = pools.filter(
    (p) =>
      (p.token0.address === token1Address.toLowerCase() &&
        !p.token1.isFeeOnTransfer &&
        p.token1.status === 'APPROVED') ||
      (p.token1.address === token1Address.toLowerCase() &&
        !p.token0.isFeeOnTransfer &&
        p.token0.status === 'APPROVED'),
  )
  // console.log(`Flattened pools, recieved: t0: ${token0Pools.length}, t1: ${token1Pools.length}`)

  // const topPoolIds = result[2].map((p) => p.id)
  const filteredToken0Pools = token0Pools.filter(
    (p) => !topPoolAddresses.includes(p.address),
  )
  const filteredToken1Pools = token1Pools.filter(
    (p) => !topPoolAddresses.includes(p.address),
  )
  // console.log(`After excluding top pools: t0: ${filteredToken0Pools.length}, t1: ${filteredToken1Pools.length}`)

  if (
    filteredToken0Pools.length >= size / 2 &&
    filteredToken1Pools.length >= size / 2
  ) {
    token0PoolSize = size / 2
    token1PoolSize = size / 2
  } else if (
    filteredToken0Pools.length >= size / 2 &&
    filteredToken1Pools.length < size / 2
  ) {
    token1PoolSize = filteredToken1Pools.length
    token0PoolSize = size - filteredToken1Pools.length
  } else if (
    filteredToken1Pools.length >= size / 2 &&
    filteredToken0Pools.length < size / 2
  ) {
    token0PoolSize = filteredToken0Pools.length
    token1PoolSize = size - filteredToken0Pools.length
  } else {
    token0PoolSize = filteredToken0Pools.length
    token1PoolSize = filteredToken1Pools.length
  }

  const pools0 = filteredToken0Pools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, token0PoolSize)
  const pools1 = filteredToken1Pools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, token1PoolSize)

  return Array.from(new Set([...pools0, ...pools1].flat()))
}

export function filterTopPools(pools: PoolResponse2[], size: number) {
  const safePools = pools.filter(
    (p) =>
      p.token0.status === 'APPROVED' &&
      !p.token0.isFeeOnTransfer &&
      p.token1.status === 'APPROVED' &&
      !p.token1.isFeeOnTransfer,
  )

  const commonPools = safePools.filter(
    (p) => p.token0.isCommon && p.token1.isCommon,
  )

  const topPools = safePools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, safePools.length <= size ? size : size - commonPools.length)

  return [...topPools, ...commonPools]
}

export function mapToken(
  chainId: number,
  {
    address,
    decimals,
    symbol,
    name,
  }: {
    address: string
    decimals: number
    symbol: string
    name: string
  },
): Token {
  return new Token({
    chainId,
    address,
    decimals,
    symbol,
    name,
  })
}
