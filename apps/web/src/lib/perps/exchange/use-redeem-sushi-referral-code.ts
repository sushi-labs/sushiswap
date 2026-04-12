import { redeemPerpsSushiReferralCode } from '@sushiswap/graph-client/data-api'
import { createFailedToast, createSuccessToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet'
import { useAgent } from '../agent'
import { TOAST_AUTOCLOSE_TIME } from '../config'
import { normalizePerpsReferralCode } from '../referral-code'
import {
  buildSushiReferralRedemptionMessage,
  extractGraphQLErrorMessage,
  getSushiReferralRedemptionExpiry,
  sushiReferralQueryKeys,
} from '../sushi-referral'

type RedeemSushiReferralCodeErrorKind = 'terminal' | 'retryable'

function classifyRedeemSushiReferralCodeError(
  message: string,
): RedeemSushiReferralCodeErrorKind {
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('invalid referral code') ||
    normalizedMessage.includes('self referral') ||
    normalizedMessage.includes('already linked') ||
    normalizedMessage.includes('already redeemed')
  ) {
    return 'terminal'
  }

  return 'retryable'
}

export function useRedeemSushiReferralCode({
  silent = false,
  onSuccess,
  onTerminalError,
  onRetryableError,
}: {
  silent?: boolean
  onSuccess?: () => void | Promise<void>
  onTerminalError?: (message: string) => void | Promise<void>
  onRetryableError?: (message: string) => void | Promise<void>
} = {}) {
  const address = useAccount('evm')
  const { agentAccount } = useAgent()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['useRedeemSushiReferralCode', address],
    mutationFn: async ({ code }: { code: string }) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      if (!agentAccount) {
        throw new Error(
          'Approve the Sushi perps session before redeeming a referral code',
        )
      }

      const normalizedCode = normalizePerpsReferralCode(code)
      const expiresAt = getSushiReferralRedemptionExpiry()
      const signature = await agentAccount.signMessage({
        message: buildSushiReferralRedemptionMessage({
          address,
          code: normalizedCode,
          expiresAt,
        }),
      })

      return redeemPerpsSushiReferralCode({
        address,
        code: normalizedCode,
        expiresAt,
        signature,
      })
    },
    onSuccess: async () => {
      const ts = Date.now()

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: sushiReferralQueryKeys.overview(address),
        }),
      ])

      if (!silent) {
        createSuccessToast({
          summary: 'Referral code applied successfully.',
          type: 'burn',
          account: address ?? '0x00',
          chainId: 1,
          groupTimestamp: ts,
          timestamp: ts,
          autoClose: TOAST_AUTOCLOSE_TIME,
        })
      }

      await onSuccess?.()
    },
    onError: async (error) => {
      const ts = Date.now()
      const message = extractGraphQLErrorMessage(error.message)
      const kind = classifyRedeemSushiReferralCodeError(message)

      if (kind === 'terminal') {
        await onTerminalError?.(message)
      } else {
        await onRetryableError?.(message)
      }

      if (!silent) {
        createFailedToast({
          summary: message,
          type: 'burn',
          account: address ?? '0x00',
          chainId: 1,
          groupTimestamp: ts,
          timestamp: ts,
          autoClose: TOAST_AUTOCLOSE_TIME,
        })
      }
    },
  })
}
