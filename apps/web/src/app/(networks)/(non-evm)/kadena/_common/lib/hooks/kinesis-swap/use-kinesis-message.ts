import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'

const messageReponseSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  sender: z.string(),
  recipient: z.string(),
  originTx: z.string(),
  messageIdentifier: z.string(),
  timeSent: z.string(),
  timestamp: z.string(),
  warpedToken: z.string(),
  status: z.enum(['completed', 'pending', 'orphaned_destination']),
})

const formatStatus = (status: string): 'pending' | 'success' | 'error' => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'pending':
      return 'pending'
    case 'orphaned_destination':
      return 'error'
    default:
      return 'pending'
  }
}

export const useKinesisMessage = ({
  txHash,
  enabled = true,
}: {
  txHash: string | undefined
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['kinesis-x-chain-swap-message', txHash, enabled],
    queryFn: async () => {
      if (!txHash) throw new Error('Missing txHash for message')

      const url = new URL(
        '/kadena/api/cross-chain/message',
        window.location.origin,
      )
      url.searchParams.set('hash', txHash)

      const res = await fetch(url.toString())
      const data = await res.json()

      if (!data) {
        throw new Error(`No data for ${txHash}`)
      }

      const parsed = messageReponseSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error('Failed to parse message response')
      }

      return { ...parsed.data, status: formatStatus(parsed.data.status) }
    },
    staleTime: ms('20s'),
    refetchInterval: ms('20s'),
    enabled: Boolean(txHash && enabled),
  })
}
