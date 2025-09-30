'use client'

import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BLADE_API_HOST, BLADE_API_KEY } from 'src/lib/constants'
import { sz } from 'sushi'
import { isAddress } from 'viem'
import { z } from 'zod'

const rfqDepositResponseBaseSchema = z.object({
  sender: sz.evm.address(),
  pool_tokens: z.string(),
  good_until: z.number(),
  signature: z.object({
    v: z.number(),
    r: sz.hex(),
    s: sz.hex(),
  }),
  clipper_exchange_address: sz.evm.address(),
  extra_data: sz.hex().optional(),
})

const multipleDepositMixin = z.object({
  deposit_amounts: z.array(z.string()),
})

const singleDepositMixin = z.object({
  amount: z.string(),
  token: z.string().refine((address) => isAddress(address), {
    message: 'token does not conform to Address',
  }),
})

const lockTimeMixin = z.object({
  lock_time: z.number(),
})

const daysToLockMixin = z.object({
  n_days: z.number(),
})

export const rfqDepositResponseSchema = z.union([
  rfqDepositResponseBaseSchema.merge(multipleDepositMixin).merge(lockTimeMixin),
  rfqDepositResponseBaseSchema
    .merge(multipleDepositMixin)
    .merge(daysToLockMixin),
  rfqDepositResponseBaseSchema.merge(singleDepositMixin).merge(lockTimeMixin),
  rfqDepositResponseBaseSchema.merge(singleDepositMixin).merge(daysToLockMixin),
])

export interface RfqDepositPayload {
  sender: string
  deposit: { [address: string]: string }
  chain_id: number
  single_asset?: boolean
  pool_address: string
  lock_time?: number
  days_to_lock?: number
}

export type RfqDepositResponse = z.infer<typeof rfqDepositResponseSchema>

export const useBladeDepositRequest = ({
  onError,
}: {
  onError?: (e: Error) => void
} = {}) => {
  const mutation = useMutation({
    mutationFn: async (
      payload: RfqDepositPayload,
    ): Promise<RfqDepositResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create deposit signature')
      }

      const responseData = await response.json()
      return rfqDepositResponseSchema.parse(responseData)
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
