'use client'

import { Card, SkeletonBox, SkeletonText, classNames } from '@sushiswap/ui'
import { currencyFormatter, useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { getProgressPercent } from './points-threshold-progress'

const multiplierFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

function formatMultiplier(value: number) {
  return `${multiplierFormatter.format(value)}x`
}

export function PointsThresholdProgressCard() {
  const address = useAccount('evm')
  const overview = useSushiPointsOverview({ address })
  const data = overview.data
  const thresholds = [...(data?.pointMultipliers ?? [])].sort(
    (a, b) => a.thresholdUsd - b.thresholdUsd,
  )
  const totalFeesUsd = data?.totalFeesUsd ?? 0
  const progressPercent = getProgressPercent({ totalFeesUsd, thresholds })
  const currentThreshold = thresholds.findLast(
    (threshold) => totalFeesUsd >= threshold.thresholdUsd,
  )
  const currentMultiplier = currentThreshold?.multiplier ?? 1

  return (
    <Card className="border-transparent !bg-[#18223B] p-2 !rounded-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-medium">Point multiplier progress</h2>
            <p className="text-xs text-slate-400">
              Earn higher point multipliers as your cumulative perps fees cross
              each threshold.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {data?.baseMultiplier ? (
              <div className="rounded-md border border-blue/40 bg-blue/10 px-3 py-2 text-blue">
                <div className="text-[11px]">Base multiplier</div>
                <div className="text-sm font-medium">
                  {formatMultiplier(data.baseMultiplier)}
                </div>
              </div>
            ) : null}
            <div className="rounded-md bg-[#0D1421] px-3 py-2">
              <div className="text-[11px] text-slate-400">Current tier</div>
              {overview.isLoading ? (
                <SkeletonText fontSize="sm" className="w-12" />
              ) : (
                <div className="text-sm font-medium">
                  {formatMultiplier(currentMultiplier)}
                </div>
              )}
            </div>
            <div className="rounded-md bg-[#0D1421] px-3 py-2">
              <div className="text-[11px] text-slate-400">Total fees</div>
              {overview.isLoading ? (
                <SkeletonText fontSize="sm" className="w-20" />
              ) : (
                <div className="text-sm font-medium">
                  {currencyFormatter.format(totalFeesUsd)}
                </div>
              )}
            </div>
          </div>
        </div>

        {overview.isLoading ? (
          <div className="flex flex-col gap-3">
            <SkeletonBox className="h-3 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-0">
              {new Array(5).fill(0).map((_, index) => (
                <div
                  key={`points-threshold-skeleton-${index}`}
                  className="flex min-w-0 flex-1 flex-col gap-1 rounded-md bg-[#0D1421] p-2 md:rounded-none md:bg-transparent md:px-0 md:py-0"
                >
                  <SkeletonBox className="!h-[14px] !w-24 max-w-full my-px" />
                  <SkeletonBox className="!h-[14.5px] !w-16 max-w-full my-px" />
                </div>
              ))}
            </div>
          </div>
        ) : overview.error ? (
          <div className="text-sm text-red-500">Error loading point tiers</div>
        ) : thresholds.length === 0 ? (
          <div className="text-sm text-slate-400">
            No point tiers available.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className="relative h-3 overflow-hidden rounded-full bg-[#0D1421]"
              aria-label="Point multiplier threshold progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(progressPercent)}
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-blue transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="absolute inset-0 flex">
                {thresholds.map((threshold) => (
                  <div
                    key={`threshold-divider-${threshold.thresholdUsd}`}
                    className="h-full flex-1 border-l border-[#18223B] first:border-l-0"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:gap-0">
              {thresholds.map((threshold) => {
                const isAchieved = totalFeesUsd >= threshold.thresholdUsd

                return (
                  <div
                    key={threshold.thresholdUsd}
                    className="flex min-w-0 flex-1 flex-col gap-1 rounded-md bg-[#0D1421] p-2 md:rounded-none md:bg-transparent md:px-0 md:py-0"
                  >
                    <div
                      className={classNames(
                        'text-xs font-medium',
                        isAchieved ? 'text-blue' : 'text-slate-300',
                      )}
                    >
                      {currencyFormatter.format(threshold.thresholdUsd)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatMultiplier(threshold.multiplier)} multiplier
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
