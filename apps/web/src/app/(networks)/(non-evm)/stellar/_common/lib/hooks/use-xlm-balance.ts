import { useQuery } from '@tanstack/react-query'
import { formatDecimal } from '~stellar/_common/lib/utils/formatters'
import { useStellarWallet } from '~stellar/providers'

export const useXlmBalance = () => {
  const { connectedAddress } = useStellarWallet()
  return useQuery({
    queryKey: ['useXlmBalance'],
    queryFn: async () => {
      const balance = 50000 // TODO: fetch from stellar for connected address
      const formattedBalance = formatDecimal(balance)
      return { balance, formattedBalance }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!connectedAddress,
  })
}
