import { useQuery } from '@tanstack/react-query'
import type { Hex } from 'viem'
import * as z from 'zod'

const LiFiStatusResponseSchema = z.object({
  sending: z.object({
    txHash: z.string().transform((txHash) => txHash as Hex),
  }),
  receiving: z
    .object({
      txHash: z.string().transform((txHash) => txHash as Hex),
    })
    .optional(),
  lifiExplorerLink: z.string().optional(),
  status: z.string().optional(),
  substatus: z.string().optional(),
})

type LiFiStatusResponseType = z.infer<typeof LiFiStatusResponseSchema>

const getLiFiStatus = async (
  txHash: string,
): Promise<LiFiStatusResponseType> => {
  const url = new URL('https://li.quest/v1/status')
  url.searchParams.set('txHash', txHash)

  const response = await fetch(url)

  const json = await response.json()

  return json
}

interface UseLiFiStatusParams {
  txHash: Hex | undefined
  tradeId: string
  enabled?: boolean
}

export const useLiFiStatus = ({
  txHash,
  tradeId,
  enabled = true,
}: UseLiFiStatusParams) => {
  return useQuery({
    queryKey: ['lifiStatus', { tradeId }],
    queryFn: async () => {
      if (!txHash) throw new Error('txHash is required')

      return getLiFiStatus(txHash)
    },
    refetchInterval: 5000,
    enabled: ({ state: { data } }) =>
      enabled &&
      !!txHash &&
      data?.status !== 'DONE' &&
      data?.status !== 'FAILED',
  })
}
