import { Container, SkeletonBox } from '@sushiswap/ui'
import { MetricStrip, MetricStripItem } from '../../_ui/metrics/metric-strip'
import { HoldingsTable } from './holdings-table'

export function PortfolioStatsSkeleton() {
  return (
    <MetricStrip columns={3}>
      {['Holdings USD', 'Tokens held', 'PnL'].map((label, index) => (
        <MetricStripItem
          key={label}
          columns={3}
          index={index}
          label={label}
          value={<SkeletonBox className="h-6 w-24 rounded-md" />}
        />
      ))}
    </MetricStrip>
  )
}

export function HoldingsTableSkeleton() {
  return <HoldingsTable holdings={[]} isLoading />
}

export function PortfolioSkeleton() {
  return (
    <div aria-label="Loading portfolio" aria-busy="true">
      <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
        <SkeletonBox className="h-9 w-40 rounded-lg sm:h-10" />
        <SkeletonBox className="mt-3 h-4 w-full max-w-xl rounded-sm" />
        <SkeletonBox className="mt-2 h-4 w-3/5 max-w-md rounded-sm" />
        <div className="mt-7">
          <PortfolioStatsSkeleton />
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-10">
        <Container maxWidth="7xl" className="w-full px-4">
          <SkeletonBox className="h-7 w-28 rounded-md" />
          <SkeletonBox className="mt-2 h-4 w-52 rounded-sm" />
          <div className="mt-6">
            <HoldingsTableSkeleton />
          </div>
        </Container>
      </section>
    </div>
  )
}
