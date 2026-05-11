import { setReferrer } from '@nktkas/hyperliquid/api/exchange'
import { AbstractWalletError } from '@nktkas/hyperliquid/signing'
import {
  createFailedToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { useHyperReferral } from '../info'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'

export const SUSHI_HYPER_REFERRAL_CODE = 'SUSHISWAP'

export const useSetHyperReferrer = () => {
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })
  const {
    data: hyperReferralData,
    refetch,
    isLoading: isLoadingHyperReferralCheck,
  } = useHyperReferral({ address })
  const hasAcceptedHyperReferral = useMemo(() => {
    if (
      hyperReferralData?.referrerState?.stage === 'ready' &&
      hyperReferralData?.referrerState?.data?.code === SUSHI_HYPER_REFERRAL_CODE
    ) {
      return true
    }
    return !!hyperReferralData?.referredBy
  }, [hyperReferralData])

  const mutation = useMutation({
    mutationKey: ['cancel-twap-order', agentAccount?.address, legalCheck],
    mutationFn: async ({ referralCode }: { referralCode?: string }) => {
      const code = referralCode || SUSHI_HYPER_REFERRAL_CODE
      if (!agentAccount || !code) {
        return
      }
      if (!legalCheck?.ipAllowed || !legalCheck?.userAllowed) {
        throw new Error('Legal check failed. Cannot set referrer.')
      }
      if (code.length < 1 || code.length > 20) {
        throw new Error(
          'Invalid referral code length. Must be between 1 and 20 characters.',
        )
      }

      return setReferrer(
        {
          wallet: agentAccount,
          transport: hlHttpTransport,
        },
        { code: code },
      )
    },

    onMutate: () => {
      if (!agentAccount) return
      const ts = Date.now()

      createInfoToast({
        summary: `Setting Referrer`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ts,
        groupTimestamp: ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })

      return { ts }
    },

    onSuccess: (_res, _vars, ctx) => {
      if (!agentAccount || !ctx) return
      refetch()
      createSuccessToast({
        summary: `Referrer Set Successfully. You will now receive a 4% disount!`,
        account: agentAccount.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx.ts,
        groupTimestamp: ctx.ts,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },

    onError: (error, _vars, ctx) => {
      let message = ''
      if (error instanceof AbstractWalletError || error instanceof Error) {
        message = error.message
      }
      createFailedToast({
        summary: message || `Failed to Set Referrer`,
        account: agentAccount?.address,
        chainId: 1,
        type: 'burn',
        timestamp: ctx?.ts ?? Date.now(),
        groupTimestamp: ctx?.ts ?? Date.now(),
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })
    },
  })

  return {
    setHyperReferrerCodeAsync: mutation.mutateAsync,
    setHyperReferrerCode: mutation.mutate,
    isPending: mutation.isPending,
    hasAcceptedHyperReferral,
    isLoadingHyperReferralCheck,
  }
}
