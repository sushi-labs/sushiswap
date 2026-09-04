import { Container, SkeletonBox } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { MetricStrip, MetricStripItem } from '../../_ui/metric-strip'

const HOLDING_SKELETONS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
] as const

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
  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[680px] table-fixed"
          aria-label="Loading portfolio holdings"
          aria-busy="true"
        >
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="w-1/2 px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                Token
              </th>
              <th className="w-1/4 px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                Holdings
              </th>
              <th className="w-1/4 px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                PnL
              </th>
            </tr>
          </thead>
          <tbody>
            {HOLDING_SKELETONS.map((skeleton) => (
              <tr
                key={skeleton}
                className="border-b border-white/[0.06] last:border-b-0"
              >
                <td className="h-[84px] px-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBox className="h-11 w-11 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <SkeletonBox className="h-4 w-32 rounded-md" />
                      <SkeletonBox className="mt-2 h-3 w-44 rounded-sm" />
                    </div>
                  </div>
                </td>
                <td className="h-[84px] px-5">
                  <SkeletonBox className="ml-auto h-4 w-24 rounded-md" />
                  <SkeletonBox className="ml-auto mt-2 h-3 w-16 rounded-sm" />
                </td>
                <td className="h-[84px] px-5">
                  <SkeletonBox className="ml-auto h-4 w-28 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PerpsCard>
  )
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
