import { Container, SkeletonBox } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { MetricStrip, MetricStripItem } from '../../../_ui/metric-strip'
import { TradeActivitySkeleton } from './trade-activity'

const MARKET_STAT_SKELETONS = [
  {
    key: 'price',
    labelWidth: 'w-[34px]',
    valueWidth: 'w-32',
    detailWidth: 'w-[76px]',
  },
  {
    key: 'fdv',
    labelWidth: 'w-6',
    valueWidth: 'w-20',
    detailWidth: 'w-20',
  },
  {
    key: 'liquidity',
    labelWidth: 'w-[57px]',
    valueWidth: 'w-[151px]',
    detailWidth: 'w-[107px]',
  },
  {
    key: 'volume',
    labelWidth: 'w-[75px]',
    valueWidth: 'w-[66px]',
    detailWidth: 'w-[104px]',
  },
] as const

const TRADE_ROW_SKELETONS = ['first', 'second', 'third', 'fourth'] as const
const LAUNCH_DETAIL_SECTION_SKELETONS = [
  { section: 'market', rows: ['supply', 'launched'] },
  { section: 'liquidity-fees', rows: ['mode', 'fee-mode'] },
  { section: 'activity', rows: ['total-burned', 'developer-buy'] },
] as const

function CardHeadingSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <SkeletonBox className="h-5 w-28 rounded-md" />
      <SkeletonBox className="h-8 w-20 rounded-lg" />
    </div>
  )
}

export function TokenDetailSkeleton({
  header,
  bodyOnly = false,
}: {
  header?: ReactNode
  bodyOnly?: boolean
} = {}) {
  const renderedHeader = bodyOnly ? false : header

  return (
    <Container
      maxWidth="8xl"
      className={bodyOnly ? 'contents' : 'w-full px-4 pb-14 pt-6 sm:pt-8'}
      aria-busy="true"
      aria-label="Loading token details"
    >
      <span className="sr-only">Loading token details</span>

      {renderedHeader ?? (
        <>
          <div className="mb-5 flex items-center gap-2">
            <SkeletonBox className="h-4 w-16 rounded-sm" />
            <SkeletonBox className="h-4 w-2 rounded-sm" />
            <SkeletonBox className="h-4 w-10 rounded-sm" />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <SkeletonBox className="h-14 w-14 shrink-0 rounded-full" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <SkeletonBox className="h-8 w-36 rounded-lg sm:h-9 sm:w-52" />
                  <SkeletonBox className="h-7 w-12 rounded-md" />
                  <SkeletonBox className="h-6 w-12 rounded-full" />
                  <SkeletonBox className="h-7 w-20 rounded-full" />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <SkeletonBox className="h-4 w-32 rounded-sm" />
                  <SkeletonBox className="h-4 w-28 rounded-sm" />
                </div>
              </div>
            </div>
            <div />
          </div>
        </>
      )}

      <div className="mt-6">
        <MetricStrip>
          {MARKET_STAT_SKELETONS.map((stat, index) => (
            <MetricStripItem
              key={stat.key}
              index={index}
              className="min-h-[104px] sm:min-h-[103px]"
              label={
                <SkeletonBox
                  className={`h-[16.5px] rounded-sm ${stat.labelWidth}`}
                />
              }
              value={
                <SkeletonBox className={`h-7 rounded-md ${stat.valueWidth}`} />
              }
              detail={
                <SkeletonBox
                  className={`h-[16.5px] rounded-sm ${stat.detailWidth}`}
                />
              }
            />
          ))}
        </MetricStrip>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
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
          <div className="h-[552px] sm:h-[560px]">
            <PerpsCard className="p-4 sm:p-5" fullHeight fullWidth>
              <div className="flex items-center justify-between">
                <div>
                  <SkeletonBox className="h-5 w-24 rounded-md" />
                  <SkeletonBox className="mt-2 h-3 w-56 rounded-sm" />
                </div>
                <SkeletonBox className="h-9 w-9 rounded-lg" />
              </div>
              <SkeletonBox className="mt-5 h-12 w-full rounded-xl" />
              <SkeletonBox className="mt-5 h-[136px] w-full rounded-2xl" />
              <div className="my-3 grid grid-cols-4 gap-2">
                {['first', 'second', 'third', 'fourth'].map((preset) => (
                  <SkeletonBox key={preset} className="h-7 w-full rounded-lg" />
                ))}
              </div>
              <SkeletonBox className="h-[108px] w-full rounded-2xl" />
              <SkeletonBox className="mt-4 h-12 w-full rounded-xl" />
            </PerpsCard>
          </div>

          <TradeActivitySkeleton />

          <div className="h-[188px]">
            <PerpsCard className="p-5" fullHeight fullWidth>
              <SkeletonBox className="h-7 w-36 rounded-md" />
              <div className="mt-3 space-y-2">
                <SkeletonBox className="h-3.5 w-full rounded-sm" />
                <SkeletonBox className="h-3.5 w-3/4 rounded-sm" />
              </div>
              <SkeletonBox className="mt-5 h-14 w-full rounded-xl" />
            </PerpsCard>
          </div>

          <PerpsCard className="p-4" fullWidth>
            <SkeletonBox className="h-5 w-28 rounded-md" />
            <div className="mt-3 divide-y divide-white/[0.06]">
              {LAUNCH_DETAIL_SECTION_SKELETONS.map(({ section, rows }) => (
                <div key={section} className="pb-2 pt-4 first:pt-0 last:pb-0">
                  <SkeletonBox className="mb-1 h-3 w-20 rounded-sm" />
                  {rows.map((row) => (
                    <div
                      key={row}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <SkeletonBox className="h-3.5 w-20 rounded-sm" />
                      <SkeletonBox className="h-3.5 w-32 rounded-sm" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </PerpsCard>
        </aside>
      </div>
    </Container>
  )
}
