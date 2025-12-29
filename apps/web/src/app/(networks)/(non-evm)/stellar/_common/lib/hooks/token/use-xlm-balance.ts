import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { useStellarWallet } from '~stellar/providers'
import { getXlmBalance } from '../../soroban/xlm-helpers'

export const useXlmBalance = () => {
  const { connectedAddress } = useStellarWallet()

  return useQuery({
    queryKey: ['stellar', 'useXlmBalance', connectedAddress],
    queryFn: async () => {
      if (!connectedAddress) {
        return { balance: 0n, formattedBalance: '-' }
      }
      const balance = await getXlmBalance(connectedAddress)
      const formattedBalance = Number.parseFloat(
        formatUnits(balance, 7),
      ).toFixed(2)
      return { balance, formattedBalance }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: Boolean(connectedAddress),
  })
}
