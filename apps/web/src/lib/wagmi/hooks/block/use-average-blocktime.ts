import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { usePublicClient } from 'wagmi'

export function useAverageBlockTime(blockCount = 5) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['average-block-time', blockCount, client.chain.id],
    queryFn: async () => {
      const latestBlock = await client.getBlock() // latest
      const latestBlockNumber = Number(latestBlock.number)

      const blocks = await Promise.all(
        Array.from({ length: blockCount + 1 }).map((_, i) =>
          client.getBlock({ blockNumber: BigInt(latestBlockNumber - i) }),
        ),
      )

      const timestamps = blocks.map((b) => Number(b.timestamp)).reverse()

      const intervals = []
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1])
      }

      const avgBlockTime =
        intervals.reduce((a, b) => a + b, 0) / intervals.length

      return avgBlockTime
    },
    refetchInterval: ms('15s'),
  })
}
