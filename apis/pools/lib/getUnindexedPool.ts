import { constantProductPoolAbi, uniswapV2PairAbi } from '@sushiswap/abi'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Address, configureChains, createClient, fetchToken, FetchTokenResult, readContracts } from '@wagmi/core'

import type { getPool } from './api.js'
import { PoolType, PoolVersion } from './index.js'

const { provider } = configureChains(allChains, allProviders)

createClient({
  autoConnect: true,
  provider,
})

interface GetPoolArgs {
  chainId: number
  address: string
}

interface Pool {
  tokens: Address[]
  totalSupply: string
  swapFee: number
  twapEnabled: boolean
  type: PoolType
  version: PoolVersion
}

async function getV2Pool({ chainId, address }: GetPoolArgs): Promise<Pool> {
  const [token0, token1, totalSupply] = await readContracts({
    allowFailure: false,
    contracts: [
      { address: address, abi: uniswapV2PairAbi, functionName: 'token0', chainId },
      { address: address, abi: uniswapV2PairAbi, functionName: 'token1', chainId },
      { address: address, abi: uniswapV2PairAbi, functionName: 'totalSupply', chainId },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: totalSupply.toString(),
    swapFee: 0.003,
    twapEnabled: true,
    type: PoolType.CONSTANT_PRODUCT_POOL,
    version: PoolVersion.LEGACY,
  }
}

async function getTridentPool({ chainId, address }: GetPoolArgs): Promise<Pool> {
  // These methods should be identical for all pool types
  const [token0, token1, totalSupply, swapFee] = await readContracts({
    allowFailure: false,
    contracts: [
      { address: address, abi: constantProductPoolAbi, functionName: 'token0', chainId },
      { address: address, abi: constantProductPoolAbi, functionName: 'token1', chainId },
      { address: address, abi: constantProductPoolAbi, functionName: 'totalSupply', chainId },
      { address: address, abi: constantProductPoolAbi, functionName: 'swapFee', chainId },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: totalSupply.toString(),
    // 30 => 0.003%
    swapFee: swapFee.toNumber() / 10000,
    twapEnabled: true,
    type: PoolType.CONCENTRATED_LIQUIDITY_POOL,
    version: PoolVersion.TRIDENT,
  }
}

export async function getUnindexedPool(poolId: string): ReturnType<typeof getPool> {
  const [chainId, address] = [Number(poolId.split(':')[0]), poolId.split(':')[1]]
  if (!chainId || !address) throw new Error('Invalid pool id.')

  const { name: lpTokenName } = await fetchToken({ address: address as Address, chainId })

  let poolFetcher
  switch (lpTokenName) {
    case 'Sushi Stable LP Token':
    case 'Sushi Constant Product LP Token':
      poolFetcher = getTridentPool
      break
    case 'SushiSwap LP Token':
      poolFetcher = getV2Pool
      break
    default:
      throw new Error('Pool type not found.')
  }

  const pool = await poolFetcher({ chainId, address })

  const tokens = await Promise.all(pool.tokens.map((token) => fetchToken({ address: token, chainId })))

  const poolName = tokens.reduce((acc, cur) => `${acc}-${cur.symbol}`, '')

  // TODO: Convert to support token array when the db supports it
  const [token0, token1] = tokens as [FetchTokenResult, FetchTokenResult]

  return {
    id: poolId,
    address,
    name: poolName,
    chainId: Number(chainId),
    token0: {
      id: `${chainId}:${token0.address.toLowerCase()}`,
      address: token0.address.toLowerCase(),
      symbol: token0.symbol,
      name: token0.name,
      decimals: token0.decimals,
    },
    token1: {
      id: `${chainId}:${token1.address.toLowerCase()}`,
      address: token1.address.toLowerCase(),
      symbol: token1.symbol,
      name: token1.name,
      decimals: token1.decimals,
    },
    liquidityUSD: '0',
    volumeUSD: '0',
    volume1d: null,
    volume1w: null,
    fees1d: null,
    fees1w: null,
    feeApr: 0,
    incentiveApr: 0,
    totalApr: 0,
    isIncentivized: false,
    isBlacklisted: false,
    incentives: [],
    ...pool,
  } as Awaited<ReturnType<typeof getPool>>
}
