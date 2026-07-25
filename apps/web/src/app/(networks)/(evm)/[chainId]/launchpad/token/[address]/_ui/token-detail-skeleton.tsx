import { Container, SkeletonBox } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

const MARKET_STAT_SKELETONS = [
  'price',
  'fdv',
  'liquidity',
  'volume',
  'liquidity-change',
] as const

const TRADE_ROW_SKELETONS = ['first', 'second', 'third', 'fourth'] as const

function CardHeadingSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <SkeletonBox className="h-5 w-28 rounded-md" />
      <SkeletonBox className="h-8 w-20 rounded-lg" />
    </div>
  )
}

export function TokenDetailSkeleton() {
  return (
    <Container
      maxWidth="8xl"
      className="w-full px-4 pb-14 pt-6 sm:pt-8"
      aria-busy="true"
      aria-label="Loading token details"
    >
      <span className="sr-only">Loading token details</span>

      <div className="mb-5 flex items-center gap-2">
        <SkeletonBox className="h-3 w-16 rounded-sm" />
        <SkeletonBox className="h-3 w-2 rounded-sm" />
        <SkeletonBox className="h-3 w-10 rounded-sm" />
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <SkeletonBox className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <SkeletonBox className="h-8 w-40 rounded-lg sm:w-52" />
              <SkeletonBox className="h-6 w-14 rounded-md" />
              <SkeletonBox className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <SkeletonBox className="h-3 w-32 rounded-sm" />
              <SkeletonBox className="h-3 w-28 rounded-sm" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="h-9 w-9 rounded-lg" />
          <SkeletonBox className="h-9 w-9 rounded-lg" />
          <SkeletonBox className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      <div className="mt-6">
        <PerpsCard className="overflow-hidden" fullWidth>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
            {MARKET_STAT_SKELETONS.map((stat) => (
              <div
                key={stat}
                className="border-white/[0.06] px-4 py-4 sm:px-5 [&:not(:first-child)]:border-l"
              >
                <SkeletonBox className="h-3 w-16 rounded-sm" />
                <SkeletonBox className="mt-2 h-6 w-24 rounded-md" />
                <SkeletonBox className="mt-2 h-3 w-20 rounded-sm" />
              </div>
            ))}
          </div>
        </PerpsCard>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_480px]">
        <div className="min-w-0 space-y-4">
          <PerpsCard className="h-[540px] overflow-hidden p-2" fullWidth>
            <SkeletonBox className="h-full w-full rounded-xl" />
          </PerpsCard>

          <div className="h-[560px]">
            <PerpsCard
              className="flex min-h-0 flex-col overflow-hidden"
              fullHeight
              fullWidth
            >
              <div className="border-b border-white/[0.06] p-4">
                <CardHeadingSkeleton />
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">
                <div className="border-b border-white/[0.06] px-4 py-2">
                  <SkeletonBox className="h-3 w-full rounded-sm" />
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {TRADE_ROW_SKELETONS.map((row) => (
                    <div
                      key={row}
                      className="grid grid-cols-[40px_minmax(0,1fr)_72px_88px] items-center gap-3 px-4 py-3"
                    >
                      <SkeletonBox className="h-4 w-8 rounded-sm" />
                      <div className="space-y-1.5">
                        <SkeletonBox className="h-3 w-24 rounded-sm" />
                        <SkeletonBox className="h-2.5 w-16 rounded-sm" />
                      </div>
                      <SkeletonBox className="h-3 w-14 rounded-sm" />
                      <SkeletonBox className="h-3 w-full rounded-sm" />
                    </div>
                  ))}
                </div>
              </div>
            </PerpsCard>
          </div>
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[72px]">
          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-6 w-20 rounded-md" />
              <SkeletonBox className="h-8 w-24 rounded-lg" />
            </div>
            <SkeletonBox className="mt-6 h-24 w-full rounded-xl" />
            <SkeletonBox className="mt-3 h-24 w-full rounded-xl" />
            <SkeletonBox className="mt-5 h-11 w-full rounded-xl" />
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <SkeletonBox className="h-6 w-36 rounded-md" />
            <div className="mt-4 space-y-2">
              <SkeletonBox className="h-3 w-full rounded-sm" />
              <SkeletonBox className="h-3 w-11/12 rounded-sm" />
              <SkeletonBox className="h-3 w-3/4 rounded-sm" />
            </div>
            <SkeletonBox className="mt-5 h-14 w-full rounded-xl" />
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <SkeletonBox className="h-6 w-32 rounded-md" />
            <div className="mt-5 space-y-4">
              {['supply', 'pool-fee', 'curve'].map((detail) => (
                <div
                  key={detail}
                  className="flex items-center justify-between gap-4"
                >
                  <SkeletonBox className="h-3 w-20 rounded-sm" />
                  <SkeletonBox className="h-3 w-32 rounded-sm" />
                </div>
              ))}
            </div>
          </PerpsCard>

          <PerpsCard className="overflow-hidden" fullWidth>
            <div className="border-b border-white/[0.06] p-5">
              <SkeletonBox className="h-5 w-32 rounded-md" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <SkeletonBox className="h-4 w-24 rounded-sm" />
                <SkeletonBox className="h-4 w-14 rounded-sm" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <SkeletonBox className="h-9 w-full rounded-md" />
                <SkeletonBox className="h-9 w-full rounded-md" />
              </div>
            </div>
          </PerpsCard>
        </aside>
      </div>
    </Container>
  )
}
