import { getSnapshotCheck } from '@sushiswap/graph-client/migration-claim'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useSnapshotCheck = ({ address }: { address?: EvmAddress }) => {
  return useQuery({
    queryKey: ['useSnapshotCheck', address],
    queryFn: async () => {
      if (!address) throw new Error('No address provided')
      return await getSnapshotCheck({ address })
    },

    enabled: Boolean(address),
  })
}
