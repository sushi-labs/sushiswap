'use client'

import { SkeletonText } from '@sushiswap/ui'
import { perpsNumberFormatter, useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { Overview } from './overview'

function SummaryCard({
  label,
  value,
  isLoading,
}: {
  label: string
  value: string
  isLoading: boolean
}) {
  return (
    <PerpsCard className="p-3 gap-2 flex flex-col h-full w-full">
      <div className="text-perps-muted-50 text-xs lg:text-sm">{label}</div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : (
        <div className="font-medium text-lg md:text-2xl text-perps-muted">
          {value}
        </div>
      )}
    </PerpsCard>
  )
}

export function PointsSummaryCards() {
  const address = useAccount('evm')
  const overview = useSushiPointsOverview({ address })

  const points7d = overview.data?.points7d
    ? perpsNumberFormatter({
        value: overview.data.points7d,
        minFraxDigits: 0,
        maxFraxDigits: 0,
      })
    : '0'
  const points30d = overview.data?.points30d
    ? perpsNumberFormatter({
        value: overview.data.points30d,
        minFraxDigits: 0,
        maxFraxDigits: 0,
      })
    : '0'

  return (
    <div className="grid w-full gap-2 md:grid-cols-3">
      <Overview />
      <SummaryCard
        label="Collected in last 7 days"
        value={points7d}
        isLoading={overview.isLoading}
      />
      <SummaryCard
        label="Collected in last 30 days"
        value={points30d}
        isLoading={overview.isLoading}
      />
    </div>
  )
}
