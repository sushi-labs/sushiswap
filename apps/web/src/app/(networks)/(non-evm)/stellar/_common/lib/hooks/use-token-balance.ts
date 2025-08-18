import { useQuery } from '@tanstack/react-query'
import { formatTokenBalance } from '~stellar/_common/lib/utils/formatters'
import { useStellarWallet } from '~stellar/providers'
import { getTokenBalance } from '../soroban/token-helpers'
import type { Token } from '../types/token.type'

export const useTokenBalance = (token: Token) => {
  const { connectedAddress } = useStellarWallet()

  return useQuery({
    queryKey: ['useTokenBalance', connectedAddress],
    queryFn: async () => {
      if (!connectedAddress) return { balance: 0n, formattedBalance: '-' }
      const balance = await getTokenBalance(connectedAddress, token)
      const formattedBalance = formatTokenBalance(balance, token)
      return { balance, formattedBalance }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!connectedAddress,
  })
}
