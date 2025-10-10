import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import { SUSHISWAP_SUPPORTED_CHAIN_IDS } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useWalletPositions } from './use-wallet-positions'

export const useWalletPortfolioOverview = () => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useWalletPositions({
    address,
    chainIds: SUSHISWAP_SUPPORTED_CHAIN_IDS as PoolChainId[],
  })

  const { totalValueUSD, chains } = useMemo(() => {
    if (!data?.tokens?.length) {
      return { totalValueUSD: 0, chains: [] }
    }

    const chainMap = new Map<PoolChainId, number>()

    for (const token of data.tokens) {
      for (const chain of token.chains ?? []) {
        const current = chainMap.get(chain.chainId) ?? 0
        chainMap.set(chain.chainId, current + (chain.amountUSD ?? 0))
      }
    }

    const chains = Array.from(chainMap.entries()).map(([chainId, value]) => ({
      chainId,
      totalValueUSD: value,
    }))

    const totalValueUSD = chains.reduce((sum, c) => sum + c.totalValueUSD, 0)

    return { totalValueUSD, chains }
  }, [data])

  return {
    totalValueUSD,
    chains,
    isLoading,
    isError,
  }
}
