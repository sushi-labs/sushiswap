import snapshot from '@snapshot-labs/snapshot.js'
import { useQuery } from '@tanstack/react-query'

const SnapshotStrategies = [
  {
    name: 'erc20-balance-of',
    params: {
      address: '0x62d11bc0652e9D9B66ac0a4c419950eEb9cFadA6',
      symbol: 'SUSHIPOWAH',
      decimals: '18',
    },
  },
  {
    name: 'erc20-balance-of',
    params: {
      address: '0x6811079E3c63ED96Eb005384d7E7ec8810E3D521',
      decimals: 18,
    },
    network: '137',
  },
]

export const useVotingPower = ({
  address,
}: { address: `0x${string}` | undefined }) => {
  return useQuery({
    queryKey: ['snapshot-scores', address],
    queryFn: async () => {
      if (!address) throw new Error()

      const { vp } = await snapshot.utils.getVp(
        address,
        '1',
        SnapshotStrategies,
        'latest',
        'sushigov.eth',
        true,
      )

      return vp as number
    },
    enabled: Boolean(address),
    staleTime: 300000,
  })
}
