import type { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { usePortfolioWallet } from '../../components/user-portfolio/hooks/use-portfolio-wallet'

export const usePortfolioWalletTokensByChain = ({
  selectedChainId = null,
}: {
  selectedChainId?: number | null
}) => {
  const { address } = useAccount()
  const { data, isLoading, isError } = usePortfolioWallet({ address })

  // ✅ Filter by chain if selected
  const tokens = useMemo<PortfolioWalletToken[]>(() => {
    if (!data?.tokens?.length) return []
    if (selectedChainId == null) return data.tokens
    return data.tokens.filter((t) => t.chainId === selectedChainId)
  }, [data, selectedChainId])

  // ✅ Calculate per-chain total (optional)
  const totalUSD = useMemo(
    () => tokens.reduce((acc, t) => acc + (t.amountUSD ?? 0), 0),
    [tokens],
  )

  return {
    tokens, // individual tokens
    totalUSD, // aggregate value for current chain (or all if null)
    isLoading,
    isError,
  }
}
