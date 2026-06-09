import { createPerpsSushiReferralCode } from '@sushiswap/graph-client/data-api'
import { createFailedToast, createSuccessToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import {
  extractGraphQLErrorMessage,
  sushiReferralQueryKeys,
} from '../sushi-referral'

export const REFERRAL_REGEX = /^[A-Z0-9-]{6,20}$/
export const REFERRAL_REGEX_FOR_INPUT = REFERRAL_REGEX.source.slice(1, -1) // Remove the starting ^ and ending $ to allow partial matches for input validation

export function useCreateSushiReferralCode() {
  const address = useAccount('evm')
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: sushiReferralQueryKeys.create(address),
    mutationFn: async ({ code }: { code: string }) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }
      if (!REFERRAL_REGEX.test(code)) {
        throw new Error(
          'Invalid referral code format. Must be 6-20 characters, uppercase letters, numbers, or hyphens only.',
        )
      }

      return createPerpsSushiReferralCode({ address, code })
    },
    onSuccess: async () => {
      const ts = Date.now()

      await queryClient.invalidateQueries({
        queryKey: sushiReferralQueryKeys.overview(address),
      })

      createSuccessToast({
        summary: 'Referral code created successfully.',
        type: 'burn',
        account: address,
        chainId: 1,
        groupTimestamp: ts,
        timestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },
    onError: (error) => {
      const ts = Date.now()

      createFailedToast({
        summary: extractGraphQLErrorMessage(error.message),
        type: 'burn',
        account: address,
        chainId: 1,
        groupTimestamp: ts,
        timestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },
  })
}
