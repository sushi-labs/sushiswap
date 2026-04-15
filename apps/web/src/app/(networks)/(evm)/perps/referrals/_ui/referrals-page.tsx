'use client'

import { Card } from '@sushiswap/ui'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { RefereesCard } from './referees-card'
import { ReferralHistoryCard } from './referral-history-card'
import { ReferralsActionBar } from './referrals-action-bar'
import { ReferralsSummaryCards } from './referrals-summary-cards'

export function ReferralsPage() {
  const address = useAccount('evm')

  if (!address) {
    return (
      <Card className="flex min-h-[420px] flex-col items-center justify-center gap-4 border-transparent !bg-[#18223B] p-4 !rounded-md text-center">
        <h1 className="text-3xl font-medium">Referrals</h1>
        <p className="max-w-md text-sm text-slate-400">
          Connect your wallet to create a Sushi referral code, track rewards,
          and review your referred traders.
        </p>
        <ConnectButton namespace="evm" className="mx-auto" />
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <ReferralsActionBar />
      <ReferralsSummaryCards />
      <ReferralHistoryCard />
      <RefereesCard />
    </div>
  )
}
