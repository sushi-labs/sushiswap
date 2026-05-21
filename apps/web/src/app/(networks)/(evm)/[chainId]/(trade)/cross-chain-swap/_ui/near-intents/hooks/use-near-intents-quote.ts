'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import type { Amount } from 'sushi'
import type {
  NearIntentsQuoteRequest,
  NearIntentsQuoteResponse,
} from '~evm/api/cross-chain/near-intents/schemas'

interface UseNearIntentsQuoteParams {
  fromChainId: NearIntentsSupportedChainId
  toChainId: NearIntentsSupportedChainId
  originAsset: string | undefined
  destinationAsset: string | undefined
  amount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | undefined
  slippageBps: number
  enabled?: boolean
}

export async function fetchNearIntentsQuote(
  payload: NearIntentsQuoteRequest,
): Promise<NearIntentsQuoteResponse> {
  const response = await fetch('/api/cross-chain/near-intents/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(error?.message || `Quote API error: ${response.status}`)
  }

  return response.json()
}

export function useNearIntentsQuote({
  fromChainId,
  toChainId,
  originAsset,
  destinationAsset,
  amount,
  slippageBps,
  enabled = true,
}: UseNearIntentsQuoteParams) {
  return useQuery<NearIntentsQuoteResponse>({
    queryKey: [
      'near-intents-quote',
      fromChainId,
      toChainId,
      originAsset,
      destinationAsset,
      amount,
      slippageBps,
    ],
    queryFn: async () => {
      if (!originAsset || !destinationAsset || !amount?.gt('0')) {
        throw new Error('Invalid quote parameters')
      }

      return fetchNearIntentsQuote({
        dry: true,
        fromChainId,
        toChainId,
        originAsset,
        destinationAsset,
        amount: amount.amount.toString(),
        slippageBps,
      })
    },
    enabled: Boolean(
      enabled && originAsset && destinationAsset && amount?.gt('0'),
    ),
    staleTime: ms('30s'),
    refetchInterval: ms('30s'),
  })
}
