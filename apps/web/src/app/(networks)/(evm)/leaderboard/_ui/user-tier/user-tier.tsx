'use client'

import { Card, RollingNumber, classNames } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { useUserStats } from 'src/lib/hooks/react-query/leaderboard/use-user-stats'
import { type Tier, useTierUi } from 'src/lib/leaderboard/tiers'
import { formatNumber } from 'sushi'
import { useAccount } from 'wagmi'
import { NoPointsState } from './no-points-state'
import { ProgressBar } from './progress-bar'
import { TierIcon } from './tier-icon'
import { TierSkeleton } from './tier-skeleton'
import { UnconnectedState } from './unconnected-state'

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
export const UserTier = () => {
  const { address, isConnected } = useAccount()
  const { data: userStats, isLoading } = useUserStats({
    address,
    enabled: Boolean(address),
  })

  const tierData = useMemo(
    () => useTierUi(userStats?.totalPoints ?? 0),
    [userStats?.totalPoints],
  )

  if (!isConnected) {
    return <UnconnectedState />
  }
  if (isLoading) {
    return <TierSkeleton />
  }

  if (!userStats?.totalPoints || userStats?.totalPoints === 0) {
    return <NoPointsState />
  }

  return (
    <Card>
      <div className="px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="uppercase font-semibold text-muted-foreground">
            Your Current Tier
          </p>
          <div className="flex items-center gap-6">
            <div
              className={classNames(
                'min-w-[48px] w-[48px] h-12 rounded-xl flex items-center justify-center',
                tierData.currentTier.accent.bgClass,
              )}
            >
              <TierIcon tier={tierData.currentTier.icon} />
            </div>
            <div className="flex flex-col w-full">
              <p className="font-bold text-2xl">{tierData.currentTier.name}</p>
              <p className="text-muted-foreground">
                Unlock new tiers the more you earn. You are in the top 5% of
                traders this season.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-2 w-full">
          <div className="flex justify-between items-end w-full">
            <p className="font-bold text-2xl">
              <RollingNumber
                value={userStats?.totalPoints ?? 0}
                format={{ minimumFractionDigits: 0 }}
                suffix=" pts"
              />
            </p>
            <p className="text-sm text-muted-foreground uppercase font-medium">
              {formatter.format(tierData.ptsToNextRank)} pts to{' '}
              {tierData.nextTier?.name ?? ''}
            </p>
          </div>
          <ProgressBar
            current={userStats?.totalPoints}
            target={tierData.nextTier?.minPoints ?? 0}
          />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {tierData.milestones.map((milestone, idx) => (
            <PointTierBox
              key={idx}
              isFilled={milestone.isFilled}
              isNext={milestone.isNext}
              pointsPerBlock={milestone.pointsPerBlock}
              delayMs={idx * 200}
            />
          ))}
          <NextTierItem nextTier={tierData?.nextTier} />
        </div>
      </div>
    </Card>
  )
}

const NextTierItem = ({ nextTier }: { nextTier: Tier | null }) => {
  return (
    <div
      className={classNames(
        'h-10 w-full rounded-lg text-sm flex items-center justify-center font-bold border-2 text-muted-foreground border-black/8 dark:border-white/8',
        // 'bg-gradient-to-br from-[#FFFBD4] to-[#D3D3D3]',
        nextTier?.accent?.bgClass,
      )}
    >
      {nextTier ? <TierIcon tier={nextTier.icon} className="w-5 h-5" /> : '???'}
    </div>
  )
}
const PointTierBox = ({
  isFilled,
  isNext,
  pointsPerBlock,
  delayMs,
}: {
  isFilled: boolean
  isNext: boolean
  pointsPerBlock: number
  delayMs: number
}) => {
  const [changeBg, setChangeBg] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setChangeBg(true), 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={classNames(
        'h-10 w-full rounded-lg text-sm flex items-center justify-center font-bold',
        isFilled && changeBg
          ? 'bg-[#3B82F633] border border-[#60A5FA80]'
          : 'border-dashed border-2 text-muted-foreground border-black/5 dark:border-white/5',
        isNext && !isFilled ? 'animate-pulse !border-[#60A5FA]/20' : '',
      )}
      style={{
        transition: `background 250ms ease ${delayMs}ms, border 250ms ease ${delayMs}ms`,
      }}
    >
      {formatNumber(pointsPerBlock)}
    </div>
  )
}
