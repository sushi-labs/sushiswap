'use client'

import { Card } from '@sushiswap/ui'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { PointsHistoryCard } from './points-history-card'
import { PointsSummaryCards } from './points-summary-cards'

export function PointsPage() {
  const address = useAccount('evm')

  if (!address) {
    return (
      <Card className="flex min-h-[420px] flex-col items-center justify-center gap-4 border-transparent !bg-[#18223B] p-4 !rounded-md text-center">
        <h1 className="text-3xl font-medium">Points</h1>
        <p className="max-w-md text-sm text-slate-400">
          Connect your wallet to view your perps points, see recent activity,
          and track your points history.
        </p>
        <ConnectButton namespace="evm" className="mx-auto" />
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <PointsSummaryCards />
      <PointsHistoryCard />
    </div>
  )
}
