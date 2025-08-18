import { useQuery } from '@tanstack/react-query'
import { formatXLM } from '~stellar/_common/lib/utils/formatters'
import { useStellarWallet } from '~stellar/providers'
import { getXlmBalance } from '../soroban/xlm-helpers'

export const useXlmBalance = () => {
  const { connectedAddress } = useStellarWallet()

  return useQuery({
    queryKey: ['useXlmBalance', connectedAddress],
    queryFn: async () => {
      if (!connectedAddress) return { balance: 0n, formattedBalance: '-' }
      const balance = await getXlmBalance(connectedAddress)
      const formattedBalance = formatXLM(balance)
      return { balance, formattedBalance }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!connectedAddress,
  })
}
