'use client'

import { useQuery } from '@tanstack/react-query'
import { BLADE_API_HOST, BLADE_API_KEY } from 'src/lib/constants'
import type { BladeChainId } from 'sushi/evm'
import { useConnection } from 'wagmi'
import * as z from 'zod'

const rfqAllowDepositResponseBaseSchema = z.object({
  allow: z.boolean(),
  usd_limit: z.number(),
  feature_single_asset_deposit: z.boolean(),
})

export const rfqAllowDepositResponseSchema = z.union([
  rfqAllowDepositResponseBaseSchema.extend({
    min_lock_time: z.number(),
  }),
  rfqAllowDepositResponseBaseSchema.extend({
    min_days_to_lock: z.number(),
  }),
])

export interface RfqAllowDepositPayload {
  sender: string
  chain_id: number
  pool_address: string
}

export type RfqAllowDepositResponse = z.infer<
  typeof rfqAllowDepositResponseSchema
>

function getAllowDepositQueryKey({
  chainId,
  poolAddress,
  address,
}: {
  chainId: BladeChainId
  poolAddress: string
  address?: string
}) {
  return [
    'blade',
    'pool',
    `${chainId}:${poolAddress}`,
    'allow-deposit',
    address,
  ] as const
}

export const useBladeAllowDeposit = ({
  chainId,
  poolAddress,
  enabled = true,
}: {
  chainId: BladeChainId
  poolAddress: string
  enabled?: boolean
}) => {
  const { address } = useConnection()

  const queryKey = getAllowDepositQueryKey({ chainId, poolAddress, address })

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<RfqAllowDepositResponse> => {
      if (!address) throw new Error('No address provided')

      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/allow-deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'X-Api-Key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify({
          chain_id: chainId,
          sender: address,
          pool_address: poolAddress,
        } satisfies RfqAllowDepositPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to check deposit permission')
      }

      const responseData = await response.json()

      return rfqAllowDepositResponseSchema.parse(responseData)
    },
    enabled: Boolean(enabled && address && chainId && poolAddress),
  })

  return query
}
