import { createPerpsSushiReferralCode } from '@sushiswap/graph-client/data-api'
import { createFailedToast, createSuccessToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import {
  extractGraphQLErrorMessage,
  sushiReferralQueryKeys,
} from '../sushi-referral'

export function useCreateSushiReferralCode() {
  const address = useAccount('evm')
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: sushiReferralQueryKeys.create(address),
    mutationFn: async () => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      return createPerpsSushiReferralCode({ address })
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
      })
    },
  })
}
