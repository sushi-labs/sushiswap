import { useQuery } from '@tanstack/react-query'
import { getPoolContractClient } from '../../soroban/client'

export const useFeeRate = ({
  pairAddress,
}: { pairAddress: string | undefined | null }) => {
  return useQuery({
    queryKey: ['useFeeRate', { pairAddress }],
    queryFn: async (): Promise<`${number}`> => {
      if (!pairAddress) {
        return '0'
      }
      const poolContractClient = getPoolContractClient({
        contractId: pairAddress,
      })
      try {
        const { result: fee } = await poolContractClient.fee()
        return `${fee}`
      } catch (error) {
        console.error('Error fetching pool fee', pairAddress, error)
        return '0'
      }
    },
    enabled: !!pairAddress,
  })
}
