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
import { useReferral } from '../info'
import { useLegalCheck } from '../info/use-legal-check'
import { hlHttpTransport } from '../transports'

export const SUSHI_REFERRAL_CODE = 'TYSIRAVO' //todo: set this to the actual referral code once it's created

export const useSetReferrer = () => {
  const { agentAccount } = useAgent()
  const address = useAccount('evm')
  const { data: legalCheck } = useLegalCheck({ address })
  const { data: referralData, refetch } = useReferral({ address })
  const hasAcceptedReferral = useMemo(() => {
    if (
      referralData?.referrerState?.stage === 'ready' &&
      referralData?.referrerState?.data?.code === SUSHI_REFERRAL_CODE
    ) {
      return true
    }
    return !!referralData?.referredBy
  }, [referralData])

  const mutation = useMutation({
    mutationKey: ['cancel-twap-order', agentAccount?.address, legalCheck],
    mutationFn: async ({ referralCode }: { referralCode?: string }) => {
      const code = referralCode || SUSHI_REFERRAL_CODE
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
      })
    },
  })

  return {
    setReferrerCodeAsync: mutation.mutateAsync,
    setReferrerCode: mutation.mutate,
    isPending: mutation.isPending,
    hasAcceptedReferral,
  }
}
