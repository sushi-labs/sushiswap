import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { usePortfolioWallet } from '../../components/user-portfolio/hooks/use-portfolio-wallet'

export const usePortfolioWalletTokensByChain = ({
  selectedChainId = null,
}: {
  selectedChainId?: EvmChainId | null
}) => {
  const { address } = useAccount()
  const { data, isLoading, isError } = usePortfolioWallet({ address })

  const tokens = useMemo<PortfolioWalletToken[]>(() => {
    if (!data?.tokens?.length) return []
    if (selectedChainId === null) return data.tokens
    return data.tokens.filter((t) => t.chainId === selectedChainId)
  }, [data, selectedChainId])

  const totalUSD = useMemo(
    () => tokens.reduce((acc, t) => acc + (t.amountUSD ?? 0), 0),
    [tokens],
  )

  return {
    tokens,
    totalUSD,
    isLoading,
    isError,
  }
}
