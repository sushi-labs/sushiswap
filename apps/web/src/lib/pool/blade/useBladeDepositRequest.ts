'use client'

import { useTimeout } from '@sushiswap/hooks'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
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
  token: sz.evm.address(),
})

const lockTimeMixin = z.object({
  lock_time: z.number(),
})

const daysToLockMixin = z.object({
  n_days: z.number(),
})

export const rfqDepositResponseSchema = z.union([
  rfqDepositResponseBaseSchema
    .extend(multipleDepositMixin.shape)
    .extend(lockTimeMixin.shape),
  rfqDepositResponseBaseSchema
    .extend(multipleDepositMixin.shape)
    .extend(daysToLockMixin.shape),
  rfqDepositResponseBaseSchema
    .extend(singleDepositMixin.shape)
    .extend(lockTimeMixin.shape),
  rfqDepositResponseBaseSchema
    .extend(singleDepositMixin.shape)
    .extend(daysToLockMixin.shape),
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
  const [refreshDelay, setRefreshDelay] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: async (
      payload: RfqDepositPayload,
    ): Promise<RfqDepositResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'X-Api-Key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create deposit signature')
      }

      const responseData = await response.json()
      return rfqDepositResponseSchema.parse(responseData)
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
