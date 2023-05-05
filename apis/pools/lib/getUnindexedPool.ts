import { constantProductPoolAbi, uniswapV2PairAbi, v3baseAbi } from '@sushiswap/abi'
import { PoolType, PoolVersion } from '@sushiswap/database'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Address, configureChains, createClient, fetchToken, FetchTokenResult, readContracts } from '@wagmi/core'

import type { getEarnPool } from './api/index.js'

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
  version: PoolVersion
}

async function getV2Pool({ chainId, address }: GetPoolArgs): Promise<Pool> {
  const [token0, token1, totalSupply] = await readContracts({
    allowFailure: false,
    contracts: [
      { address: address as Address, abi: uniswapV2PairAbi, functionName: 'token0', chainId },
      { address: address as Address, abi: uniswapV2PairAbi, functionName: 'token1', chainId },
      { address: address as Address, abi: uniswapV2PairAbi, functionName: 'totalSupply', chainId },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: totalSupply.toString(),
    swapFee: 0.003,
    twapEnabled: true,
    version: PoolVersion.LEGACY,
  }
}

async function getTridentPool({ chainId, address }: GetPoolArgs): Promise<Pool> {
  // These methods should be identical for all pool types
  const [token0, token1, totalSupply, swapFee] = await readContracts({
    allowFailure: false,
    contracts: [
      { address: address as Address, abi: constantProductPoolAbi, functionName: 'token0', chainId },
      { address: address as Address, abi: constantProductPoolAbi, functionName: 'token1', chainId },
      { address: address as Address, abi: constantProductPoolAbi, functionName: 'totalSupply', chainId },
      { address: address as Address, abi: constantProductPoolAbi, functionName: 'swapFee', chainId },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: totalSupply.toString(),
    // 30 => 0.003%
    swapFee: swapFee.toNumber() / 10000,
    twapEnabled: true,
    version: PoolVersion.TRIDENT,
  }
}

async function getV3Pool({ chainId, address }: GetPoolArgs): Promise<Pool> {
  const [token0, token1, liquidity, fee] = await readContracts({
    allowFailure: false,
    contracts: [
      { address: address as Address, abi: v3baseAbi, functionName: 'token0', chainId },
      { address: address as Address, abi: v3baseAbi, functionName: 'token1', chainId },
      { address: address as Address, abi: v3baseAbi, functionName: 'liquidity', chainId },
      { address: address as Address, abi: v3baseAbi, functionName: 'fee', chainId },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: liquidity.toString(),
    // 500 is 0.05%. divide it by 1M to get the 0.0005 format
    swapFee: fee / 1_000_000,
    twapEnabled: true,
    version: PoolVersion.V3,
  }
}

// Thought ReturnType would be enough, needed to wrap it to make TS happy
export async function getUnindexedPool(poolId: string): Promise<Awaited<ReturnType<typeof getEarnPool>>> {

  const [chainId, address] = [Number(poolId.split(':')[0]), poolId.split(':')[1]]
  if (!chainId || !address) throw new Error('Invalid pool id.')

  let lpTokenName
  try {
    lpTokenName = (await fetchToken({ address: address as Address, chainId })).name
  } catch (e) {
    lpTokenName = 'V3'
  }

  let poolFetcher
  let poolType
  switch (lpTokenName) {
    case 'Sushi Stable LP Token':
      poolType = PoolType.STABLE_POOL
      poolFetcher = getTridentPool
      break
    case 'Sushi Constant Product LP Token':
      poolType = PoolType.CONSTANT_PRODUCT_POOL
      poolFetcher = getTridentPool
      break
    case 'SushiSwap LP Token':
      poolType = PoolType.CONSTANT_PRODUCT_POOL
      poolFetcher = getV2Pool
      break
    default:
      poolType = PoolType.CONCENTRATED_LIQUIDITY_POOL
      poolFetcher = getV3Pool
  }

  const pool = await poolFetcher({ chainId, address })

  const tokens = await Promise.all(pool.tokens.map((token) => fetchToken({ address: token, chainId })))

  const poolName = tokens.map(({ symbol }) => symbol).join('-')

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
    volume1d: '0',
    volume1w: '0',
    fees1d: '0',
    fees1w: '0',
    feeApr: 0,
    incentiveApr: 0,
    totalApr: 0,
    isIncentivized: false,
    wasIncentivized: false,
    isBlacklisted: false,
    incentives: [],
    type: poolType,
    ...pool,
  } as Awaited<ReturnType<typeof getEarnPool>>
}
