'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { useAgent } from './agent'
import { useRedeemSushiReferralCode } from './exchange'
import { useSushiReferralOverview } from './info'
import {
  PENDING_PERPS_INVITE_KEY,
  type PendingPerpsInvite,
  bindPendingPerpsInviteToAddress,
  canRetryPendingInvite,
  isAddressEligibleForPendingInvite,
  markPendingInviteAttempt,
} from './pending-invite'

export function AutoApplyInvite() {
  const address = useAccount('evm')
  const [pendingInvite, setPendingInvite, removePendingInvite] =
    useLocalStorage<PendingPerpsInvite | undefined>(
      PENDING_PERPS_INVITE_KEY,
      undefined,
    )
  const overview = useSushiReferralOverview({ address })
  const { agentAccount, sushiAgent } = useAgent()

  const isAgentReady = useMemo(() => {
    if (!agentAccount || !sushiAgent?.address) {
      return false
    }

    if (sushiAgent.validUntil && sushiAgent.validUntil <= Date.now()) {
      return false
    }

    return (
      agentAccount.address.toLowerCase() === sushiAgent.address.toLowerCase()
    )
  }, [agentAccount, sushiAgent])

  const redeemInvite = useRedeemSushiReferralCode({
    silent: true,
    onSuccess: async () => {
      removePendingInvite()
      await overview.refetch()
    },
    onTerminalError: async () => {
      removePendingInvite()
    },
  })

  useEffect(() => {
    if (!address || !pendingInvite) {
      return
    }

    const nextInvite = bindPendingPerpsInviteToAddress(pendingInvite, address)

    if (JSON.stringify(nextInvite) !== JSON.stringify(pendingInvite)) {
      setPendingInvite(nextInvite)
    }
  }, [address, pendingInvite, setPendingInvite])

  useEffect(() => {
    if (!address || !pendingInvite) {
      return
    }

    if (!isAddressEligibleForPendingInvite(pendingInvite, address)) {
      return
    }

    if (!canRetryPendingInvite(pendingInvite)) {
      return
    }

    if (
      !isAgentReady ||
      overview.isLoading ||
      !overview.data ||
      redeemInvite.isPending
    ) {
      return
    }

    if (overview.data.hasRedeemedReferralCode) {
      removePendingInvite()
      return
    }

    const nextInvite = markPendingInviteAttempt(pendingInvite, address)
    setPendingInvite(nextInvite)
    void redeemInvite.mutateAsync({ code: pendingInvite.code })
  }, [
    address,
    isAgentReady,
    overview.data,
    overview.isLoading,
    pendingInvite,
    redeemInvite,
    removePendingInvite,
    setPendingInvite,
  ])

  return null
}
