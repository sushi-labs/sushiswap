'use client'

import { Card, SkeletonText } from '@sushiswap/ui'
import { useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatNumber } from 'sushi'

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
    <Card className="p-2 !rounded-md gap-2 flex !bg-[#18223B] border-transparent flex-col justify-between w-full">
      <div className="text-muted-foreground text-xs lg:text-sm">{label}</div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">{value}</div>
      )}
    </Card>
  )
}

export function PointsSummaryCards() {
  const address = useAccount('evm')
  const overview = useSushiPointsOverview({ address })

  const currentPoints = overview.data?.totalPoints
    ? formatNumber(overview.data.totalPoints, 0)
    : '0'
  const points7d = overview.data?.points7d
    ? formatNumber(overview.data.points7d, 0)
    : '0'
  const points30d = overview.data?.points30d
    ? formatNumber(overview.data.points30d, 0)
    : '0'

  return (
    <div className="grid w-full gap-2 md:grid-cols-3">
      <SummaryCard
        label="Current points"
        value={currentPoints}
        isLoading={overview.isLoading}
      />
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
