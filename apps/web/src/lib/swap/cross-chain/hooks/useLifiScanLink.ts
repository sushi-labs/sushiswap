import { useQuery } from '@tanstack/react-query'
import type { XSwapSupportedChainId } from 'src/config'
import * as z from 'zod'

const LiFiStatusResponseSchema = z.object({
  sending: z.object({
    txHash: z.string(),
  }),
  receiving: z
    .object({
      txHash: z.string(),
    })
    .optional(),
  lifiExplorerLink: z.string().optional(),
  status: z.string().optional(),
  substatus: z.string().optional(),
})

type LiFiStatusResponseType = z.infer<typeof LiFiStatusResponseSchema>

type LiFiStatusResponse<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
> = Omit<LiFiStatusResponseType, 'sending' | 'receiving'> & {
  sending: { txHash: TxHashFor<TChainId0> }
  receiving?: { txHash: TxHashFor<TChainId1> }
}

async function getLiFiStatus<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>(
  txHash: TxHashFor<TChainId0>,
): Promise<LiFiStatusResponse<TChainId0, TChainId1>> {
  const url = new URL('https://li.quest/v1/status')
  url.searchParams.set('txHash', txHash)

  const response = await fetch(url)

  const json = await response.json()

  const parsed = LiFiStatusResponseSchema.parse(json)

  return {
    ...parsed,
    sending: { txHash: parsed.sending.txHash as TxHashFor<TChainId0> },
    receiving: parsed.receiving
      ? { txHash: parsed.receiving.txHash as TxHashFor<TChainId1> }
      : undefined,
  }
}

interface UseLiFiStatusParams<TChainId0 extends XSwapSupportedChainId> {
  txHash: TxHashFor<TChainId0> | undefined
  tradeId: string
  enabled?: boolean
}

export function useLiFiStatus<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>({ txHash, tradeId, enabled = true }: UseLiFiStatusParams<TChainId0>) {
  return useQuery({
    queryKey: ['lifiStatus', { tradeId }],
    queryFn: async () => {
      if (!txHash) throw new Error('txHash is required')

      return getLiFiStatus<TChainId0, TChainId1>(txHash)
    },
    refetchInterval: 5000,
    enabled: ({ state: { data } }) =>
      enabled &&
      !!txHash &&
      data?.status !== 'DONE' &&
      data?.status !== 'FAILED',
  })
}
