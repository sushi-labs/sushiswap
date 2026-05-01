'use client'

import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { PointsSummaryCards } from './points-summary-cards'

export function PointsPage() {
  const address = useAccount('evm')

  if (!address) {
    return (
      <PerpsCard className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-3xl font-medium">Points</h1>
        <p className="max-w-md text-sm text-perps-muted-50">
          Connect your wallet to view your perps points, see recent activity,
          and track your points history.
        </p>
        <ConnectButton
          namespace="evm"
          className="mx-auto"
          variant="perps-default"
        />
      </PerpsCard>
    )
  }

  return (
    <div className="flex flex-col gap-2 mb-7">
      <h1 className="text-4xl font-medium mb-2">Points</h1>
      <PointsSummaryCards />
    </div>
  )
}
