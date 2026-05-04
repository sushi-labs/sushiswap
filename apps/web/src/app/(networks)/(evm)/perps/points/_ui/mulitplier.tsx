import { Progress, SkeletonBox, SkeletonText } from '@sushiswap/ui'
import { useEffect, useMemo, useRef } from 'react'
import { useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUSD } from 'sushi'
import { PerpsCard } from '~evm/perps/_ui/_common'

export const Multiplier = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  const address = useAccount('evm')
  const { data, isLoading } = useSushiPointsOverview({ address })
  const pointMultipliers = useMemo(
    () => data?.pointMultipliers || [],
    [data?.pointMultipliers],
  )

  const currentFeeUsd = useMemo(() => {
    return data?.totalVolumeUsd || 0
  }, [data?.totalVolumeUsd])

  const currentMultiplier = useMemo(() => {
    if (!pointMultipliers.length) return 0
    const totalFeesUsd = currentFeeUsd
    const mulitplier =
      pointMultipliers.findLast((i) => i.thresholdUsd <= totalFeesUsd)
        ?.multiplier || 1
    return mulitplier
  }, [pointMultipliers, currentFeeUsd])

  const nextMultiplier = useMemo(() => {
    if (!pointMultipliers.length) return 0
    const totalFeesUsd = currentFeeUsd
    const nextTier = pointMultipliers.find((i) => i.thresholdUsd > totalFeesUsd)
    return nextTier?.multiplier || currentMultiplier
  }, [pointMultipliers, currentFeeUsd, currentMultiplier])

  const milestones = pointMultipliers?.slice(1)
  const activeIdx = milestones.findIndex(
    (m) => m.multiplier === currentMultiplier,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: rerun on activeIdx change
  useEffect(() => {
    const container = scrollRef.current
    const activeCard = activeRef.current
    if (!container || !activeCard) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = activeCard.getBoundingClientRect()
    const offset =
      cardRect.left -
      containerRect.left +
      cardRect.width / 2 -
      containerRect.width / 2

    container.scrollBy({ left: offset, behavior: 'smooth' })
  }, [activeIdx])

  return (
    <PerpsCard className="p-3 gap-2 flex flex-col justify-between w-full h-full">
      <div className="flex flex-col gap-2">
        <div className="text-perps-muted-50 text-xs lg:text-sm">
          Points Multiplier
        </div>
        {isLoading ? (
          <div className="w-24 h-8">
            <SkeletonText fontSize="xl" />
          </div>
        ) : (
          <div className="bg-gradient-to-r w-fit from-[#27B0E6] from-2% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text text-7xl">
            {currentMultiplier === 1 ? 1.069 : currentMultiplier}x
          </div>
        )}
      </div>
      <div className="flex gap-1 max-w-[90vw]">
        {isLoading ? (
          <div className="w-full h-[20px]">
            <SkeletonBox className="w-full h-full" />
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-start gap-1 overflow-x-auto overflow-y-visible w-full hide-scrollbar"
          >
            {milestones.map((i, idx) => {
              const distance = idx - activeIdx
              let opacity = 1
              let scale = 1

              if (distance > 0) {
                const maxDist = milestones.length - 1 - activeIdx || 1
                const ratio = distance / maxDist
                opacity = Math.max(0.25, 1 - ratio * 0.65)
                scale = Math.max(0.85, 1 - ratio * 0.12)
              }

              return (
                <div
                  ref={activeIdx === idx ? activeRef : undefined}
                  key={i.multiplier}
                  className="flex flex-col h-full gap-2 transition-all duration-300 w-full"
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin:
                      distance <= 0 ? 'right center' : 'left center',
                  }}
                >
                  <ProgressBar
                    start={
                      i.multiplier === 1
                        ? 0
                        : pointMultipliers[pointMultipliers.indexOf(i) - 1]
                            .thresholdUsd
                    }
                    end={i.thresholdUsd}
                    current={
                      currentFeeUsd > i.thresholdUsd
                        ? i.thresholdUsd
                        : currentFeeUsd
                    }
                  />
                  <div className="px-2 py-1 rounded-lg gap-1 flex items-center justify-center h-full text-xs text-perps-muted bg-[#EDF0F314]">
                    {formatUSD(i.thresholdUsd)?.replace('.00', '')}
                    {i.multiplier === nextMultiplier ? (
                      <div className="bg-[#EDF0F314] rounded-lg p-1">
                        <span className="bg-gradient-to-r from-[#27B0E6] from-4% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text">
                          {i.multiplier}x
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PerpsCard>
  )
}
const ProgressBar = ({
  start,
  end,
  current,
}: { start: number; end: number; current: number }) => {
  const progress = useMemo(() => {
    if (current <= start) return 0
    if (current >= end) return 100
    return ((current - start) / (end - start)) * 100
  }, [start, end, current])

  return (
    <Progress value={progress} className="w-full h-[4px] text-perps-blue" />
  )
}
