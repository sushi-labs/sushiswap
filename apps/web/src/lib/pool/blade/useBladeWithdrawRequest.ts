'use client'

import { useTimeout } from '@sushiswap/hooks'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { BLADE_API_HOST, BLADE_API_KEY } from 'src/lib/constants'
import { sz } from 'sushi'
import * as z from 'zod'

const rfqWithdrawResponseSchema = z.object({
  token_holder_address: sz.evm.address(),
  pool_token_amount_to_burn: z.string(),
  asset_address: sz.evm.address(),
  asset_amount: z.string(),
  good_until: z.number(),
  signature: z.object({
    v: z.number(),
    r: sz.hex(),
    s: sz.hex(),
  }),
  extra_data: sz.hex().optional(),
})

export type RfqWithdrawPayload = {
  chain_id: number
  pool_token_amount_to_burn: string
  asset_symbol: string
  token_holder_address: string
  pool_address: string
}

export type RfqWithdrawResponse = z.output<typeof rfqWithdrawResponseSchema>

export const useBladeWithdrawRequest = ({
  onError,
}: {
  onError?: (error: Error) => void
} = {}) => {
  const [refreshDelay, setRefreshDelay] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: async (
      payload: RfqWithdrawPayload,
    ): Promise<RfqWithdrawResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'X-Api-Key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const responseData = await response.json()

      return rfqWithdrawResponseSchema.parse(responseData)
    },
    onMutate: () => {
      setRefreshDelay(null)
    },
    onSuccess: (data, variables) => {
      const now = Date.now()
      const goodUntil = data.good_until * 1000
      const remainingTime = goodUntil - now

      if (remainingTime > 0) {
        setRefreshDelay(remainingTime)
      } else {
        mutation.mutate(variables)
      }
    },
    onError,
  })

  useTimeout(() => {
    if (mutation.variables) {
      mutation.mutate(mutation.variables)
    }
  }, refreshDelay)

  return mutation
}
