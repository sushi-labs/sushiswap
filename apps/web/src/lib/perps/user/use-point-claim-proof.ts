import { getPointClaimProof } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { getAddress } from 'viem'

export const usePointClaimProof = ({
  season = 'SEASON_1',
  address,
}: {
  season: 'SEASON_1' | 'SEASON_2' | 'CURRENT' //todo: get from schema
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['usePointClaimProof', season, address],
    queryFn: async () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return getPointClaimProof({
        season,
        address: getAddress(address),
      })
    },
    enabled: Boolean(address),
  })
}
