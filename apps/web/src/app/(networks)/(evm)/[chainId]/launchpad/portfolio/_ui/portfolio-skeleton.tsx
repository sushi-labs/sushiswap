import { Container, SkeletonBox } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { MetricStrip, MetricStripItem } from '../../_ui/metrics/metric-strip'

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
  // Keep this fallback static: TanStack Table reads Date.now() during render.
  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[860px] table-fixed text-sm"
          aria-label="Loading portfolio holdings"
          aria-busy="true"
        >
          <thead>
            <tr className="border-b border-white/[0.06] text-perps-muted-50">
              <th className="h-11 w-[280px] px-4 text-left font-medium">
                Token
              </th>
              <th className="w-[170px] px-4 text-right font-medium">
                Holdings
              </th>
              <th className="w-[170px] px-4 text-right font-medium">PnL</th>
              <th className="w-[200px] px-4 text-right font-medium">
                Pending rewards / your rate
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, index) => (
              <tr
                key={index}
                className="border-b border-white/[0.06] last:border-b-0"
              >
                <td className="h-[84px] px-4">
                  <div className="flex items-center gap-3">
                    <SkeletonBox className="h-11 w-11 shrink-0 rounded-full" />
                    <SkeletonBox className="h-4 w-32 rounded-md" />
                  </div>
                </td>
                {['holdings', 'pnl', 'rewards'].map((column) => (
                  <td key={column} className="px-4">
                    <SkeletonBox className="ml-auto h-4 w-24 rounded-md" />
                  </td>
                ))}
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
