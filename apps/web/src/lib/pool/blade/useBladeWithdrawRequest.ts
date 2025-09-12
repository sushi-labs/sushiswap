'use client'

import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BLADE_API_HOST, BLADE_API_KEY } from 'src/lib/constants'
import { isEvmAddress } from 'sushi/evm'
import { isHash } from 'viem'
import { z } from 'zod'

const rfqWithdrawResponseSchema = z.object({
  token_holder_address: z.string().refine(isEvmAddress, {
    message: 'token_holder_address does not conform to Address',
  }),
  pool_token_amount_to_burn: z.string(),
  asset_address: z.string().refine(isEvmAddress, {
    message: 'asset_address does not conform to Address',
  }),
  asset_amount: z.string(),
  good_until: z.number(),
  signature: z.object({
    v: z.number(),
    r: z.string().refine((hash) => isHash(hash), {
      message: 'r does not conform to Hash',
    }),
    s: z.string().refine((hash) => isHash(hash), {
      message: 's does not conform to Hash',
    }),
  }),
  extra_data: z.string().refine((hash) => isHash(hash), {
    message: 'extra_data does not conform to Hash',
  }),
})

export type RfqWithdrawPayload = {
  chain_id: number
  pool_token_amount_to_burn: string
  asset_symbol: string
  token_holder_address: string
  pool_address: string
}

export type RfqWithdrawResponse = z.infer<typeof rfqWithdrawResponseSchema>

export const useBladeWithdrawRequest = ({
  onError,
}: {
  onError?: (error: Error) => void
} = {}) => {
  const mutation = useMutation({
    mutationFn: async (
      payload: RfqWithdrawPayload,
    ): Promise<RfqWithdrawResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const responseData = await response.json()

      return rfqWithdrawResponseSchema.parse(responseData)
    },
    onError,
  })

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const now = Date.now()
      const goodUntil = mutation.data.good_until * 1000
      const remainingTime = goodUntil - now

      if (remainingTime > 0) {
        const timerId = setTimeout(() => {
          mutation.reset()
        }, remainingTime)

        return () => {
          clearTimeout(timerId)
        }
      } else {
        mutation.reset()
      }
    }
  }, [mutation.isSuccess, mutation.data, mutation.reset])

  return mutation
}
