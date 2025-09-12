import { getDexMetrics } from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'

export const useDexMetrics = () => {
  return useQuery({
    queryKey: ['kadena-dex-metrics'],
    queryFn: async () => {
      const data = await getDexMetrics({
        protocolAddress: KADENA_CONTRACT,
      })

      if (!data) throw new Error('Failed to fetch DEX metrics')
      return data
    },
    staleTime: ms('10s'),
  })
}
