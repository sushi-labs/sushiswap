import { Container, SkeletonBox } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { MetricStrip, MetricStripItem } from '../_ui/metric-strip'
import { TokenGridSkeleton } from '../_ui/token-grid'

const METRIC_SKELETONS = [
  { key: 'tokens', labelWidth: 'w-24', valueWidth: 'w-20' },
  { key: 'volume', labelWidth: 'w-20', valueWidth: 'w-24' },
  { key: 'liquidity', labelWidth: 'w-16', valueWidth: 'w-24' },
] as const

export default function LaunchpadLoading() {
  return (
    <div aria-label="Loading launches" aria-busy="true">
      <Container maxWidth="7xl" className="w-full px-4 pb-8 pt-8 sm:pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-3xl">
            <div className="sm:hidden">
              <SkeletonBox className="h-9 w-full max-w-[520px] rounded-lg" />
              <SkeletonBox className="h-9 w-24 rounded-lg min-[480px]:hidden" />
            </div>
            <div className="hidden sm:block min-[722px]:hidden">
              <SkeletonBox className="h-12 w-full max-w-[520px] rounded-xl" />
              <SkeletonBox className="h-12 w-40 rounded-xl" />
            </div>
            <SkeletonBox className="hidden h-12 w-full max-w-[650px] rounded-xl min-[722px]:block" />

            <div className="mt-3">
              <div className="flex h-6 items-center">
                <SkeletonBox className="h-4 w-full max-w-2xl rounded-sm" />
              </div>
              <div className="flex h-6 items-center">
                <SkeletonBox className="h-4 w-11/12 max-w-xl rounded-sm" />
              </div>
              <div className="flex h-6 items-center min-[480px]:hidden">
                <SkeletonBox className="h-4 w-3/5 rounded-sm" />
              </div>
            </div>
          </div>
          <SkeletonBox className="h-11 w-36 shrink-0 rounded-xl" />
        </div>

        <div className="mt-7">
          <MetricStrip>
            {METRIC_SKELETONS.map((metric, index) => (
              <MetricStripItem
                key={metric.key}
                index={index}
                label={
                  <div className="flex h-4 items-center">
                    <SkeletonBox
                      className={`h-3 rounded-sm ${metric.labelWidth}`}
                    />
                  </div>
                }
                value={
                  <SkeletonBox
                    className={`h-7 rounded-md ${metric.valueWidth}`}
                  />
                }
              />
            ))}
            <div className="flex items-center gap-3 border-l border-t border-white/[0.06] px-5 py-4 lg:border-t-0">
              <SkeletonBox className="hidden h-9 w-9 shrink-0 rounded-full sm:block" />
              <div>
                <SkeletonBox className="h-3 w-20 rounded-sm" />
                <SkeletonBox className="mt-2 h-5 w-12 rounded-sm" />
              </div>
            </div>
          </MetricStrip>
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-8">
        <Container maxWidth="7xl" className="w-full px-4">
          <PerpsCard className="p-3 sm:p-4" fullWidth>
            <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_auto]">
              <SkeletonBox className="h-10 w-full rounded-lg xl:max-w-[480px]" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <SkeletonBox className="h-10 w-full rounded-lg md:w-[150px]" />
                <SkeletonBox className="h-10 w-full shrink-0 rounded-lg sm:w-[184px]" />
              </div>
            </div>
          </PerpsCard>

          <div className="mt-6">
            <TokenGridSkeleton />
          </div>
        </Container>
      </section>
    </div>
  )
}
