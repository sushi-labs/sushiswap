import {
  type TokenListChainId,
  getTokenList,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { readContracts } from '@wagmi/core'
import ms from 'ms'
import type { EvmAddress, EvmChainId, EvmToken } from 'sushi/evm'
import { parseAbi, zeroAddress } from 'viem'
import type { Config } from 'wagmi'
import { useConfig } from 'wagmi'
import { createTokenListToken } from './token-list-token'

const poolAbi = parseAbi([
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function fee() view returns (uint24)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
])

export interface TokenSelectorPool {
  address: EvmAddress
  token0: EvmToken
  token1: EvmToken
  version: 'v2' | 'v3'
}

interface GetPoolByAddress {
  address: EvmAddress
  chainId: EvmChainId & TokenListChainId
  config: Config
}

async function getPoolToken(
  chainId: EvmChainId & TokenListChainId,
  address: EvmAddress,
): Promise<EvmToken> {
  const [token] = await getTokenList({
    chainId,
    first: 1,
    search: address,
  })

  if (!token) {
    throw new Error(`Token ${address} was not returned by the token list`)
  }

  return createTokenListToken(chainId, token)
}

export async function getPoolByAddress({
  address,
  chainId,
  config,
}: GetPoolByAddress): Promise<TokenSelectorPool | null> {
  const [token0Result, token1Result, feeResult, reservesResult] =
    await readContracts(config, {
      allowFailure: true,
      contracts: [
        { abi: poolAbi, address, chainId, functionName: 'token0' },
        { abi: poolAbi, address, chainId, functionName: 'token1' },
        { abi: poolAbi, address, chainId, functionName: 'fee' },
        { abi: poolAbi, address, chainId, functionName: 'getReserves' },
      ],
    })

  if (
    token0Result.status !== 'success' ||
    token1Result.status !== 'success' ||
    token0Result.result === zeroAddress ||
    token1Result.result === zeroAddress ||
    token0Result.result === token1Result.result
  ) {
    return null
  }

  const version =
    reservesResult.status === 'success'
      ? 'v2'
      : feeResult.status === 'success'
        ? 'v3'
        : null

  if (!version) return null

  const [token0, token1] = await Promise.all([
    getPoolToken(chainId, token0Result.result),
    getPoolToken(chainId, token1Result.result),
  ])

  return {
    address,
    token0,
    token1,
    version,
  }
}

interface UsePoolAddress {
  address: EvmAddress | undefined
  chainId: (EvmChainId & TokenListChainId) | undefined
  enabled?: boolean
}

export function usePoolAddress({
  address,
  chainId,
  enabled = true,
}: UsePoolAddress) {
  const config = useConfig()

  return useQuery({
    queryKey: ['token-selector-pool', { address, chainId }],
    queryFn: () => {
      if (!chainId) throw new Error('Chain id is required')
      if (!address) throw new Error('Pool address is required')
      return getPoolByAddress({ address, chainId, config })
    },
    enabled: Boolean(enabled && address && chainId),
    retry: false,
    staleTime: ms('15m'),
  })
}
