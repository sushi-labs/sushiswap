import { tridentConstantPoolAbi, uniswapV2PairAbi, v3baseAbi } from '@sushiswap/abi'
import { Protocol } from '@sushiswap/database'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import type { Address, FetchTokenResult } from '@wagmi/core'
import { configureChains, createConfig, fetchToken, readContracts } from '@wagmi/core'

import type { getEarnPool } from './api/index.js'

const { publicClient } = configureChains(allChains, allProviders)

createConfig({
  autoConnect: true,
  publicClient,
})

interface GetPoolArgs {
  chainId: number
  address: string
  protocol?: Protocol
}

interface Pool {
  tokens: Address[]
  totalSupply: string
  swapFee: number
  twapEnabled: boolean
  protocol: Protocol
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
    protocol: Protocol.SUSHISWAP_V2,
  }
}

async function getTridentPool({ chainId, address, protocol }: GetPoolArgs): Promise<Pool> {
  if (!protocol) throw new Error('Protocol is required for Trident pools.')
  // These methods should be identical for all pool types
  const [token0, token1, totalSupply, swapFee] = await readContracts({
    allowFailure: false,
    contracts: [
      { address: address as Address, abi: tridentConstantPoolAbi, functionName: 'token0', chainId },
      { address: address as Address, abi: tridentConstantPoolAbi, functionName: 'token1', chainId },
      { address: address as Address, abi: tridentConstantPoolAbi, functionName: 'totalSupply', chainId },
      { address: address as Address, abi: tridentConstantPoolAbi, functionName: 'swapFee', chainId },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: totalSupply.toString(),
    // 30 => 0.003%
    swapFee: Number(swapFee) / 10000,
    twapEnabled: true,
    protocol,
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
    protocol: Protocol.SUSHISWAP_V3,
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

  let poolFetcher: (args: GetPoolArgs) => Promise<Pool>
  switch (lpTokenName) {
    case 'Sushi Stable LP Token':
      poolFetcher = async ({ chainId, address }) =>
        getTridentPool({ chainId, address, protocol: Protocol.BENTOBOX_STABLE })
      break
    case 'Sushi Constant Product LP Token':
      poolFetcher = async ({ chainId, address }) =>
        getTridentPool({ chainId, address, protocol: Protocol.BENTOBOX_CLASSIC })
      break
    case 'SushiSwap LP Token':
      poolFetcher = getV2Pool
      break
    default:
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
    hasEnabledSteerVault: false,
    hadEnabledSteerVault: false,
    steerVaults: [],
    liquidityUSD: '0',
    volumeUSD: '0',
    feesUSD: '0',
    liquidityUSDChange1h: 0,
    liquidityUSDChange1d: 0,
    liquidityUSDChange1w: 0,
    liquidityUSDChange1m: 0,
    feeApr1h: 0,
    feeApr1d: 0,
    feeApr1w: 0,
    feeApr1m: 0,
    totalApr1h: 0,
    totalApr1d: 0,
    totalApr1w: 0,
    totalApr1m: 0,
    incentiveApr: 0,
    isIncentivized: false,
    wasIncentivized: false,
    volume1h: '0',
    volume1d: '0',
    volume1w: '0',
    volume1m: '0',
    volumeChange1h: 0,
    volumeChange1d: 0,
    volumeChange1w: 0,
    volumeChange1m: 0,
    fees1h: '0',
    fees1d: '0',
    fees1w: '0',
    fees1m: '0',
    feesChange1h: 0,
    feesChange1d: 0,
    feesChange1w: 0,
    feesChange1m: 0,
    isBlacklisted: false,
    incentives: [],
    ...pool,
  } as Awaited<ReturnType<typeof getEarnPool>>
}
