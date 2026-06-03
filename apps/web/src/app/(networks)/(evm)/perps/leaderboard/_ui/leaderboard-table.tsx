import type { PerpsLeaderboardEntry } from '@sushiswap/graph-client/data-api'
import { SkeletonBox, classNames } from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import {
  getTextColorClass,
  perpsNumberFormatter,
  useLeaderboard,
  useLeaderboardUser,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUSD, truncateString } from 'sushi'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { getTier } from '~evm/perps/points/_ui/overview'
import {
  TimeframeToPerpsTimeframe,
  useLeaderboardState,
} from './leaderboard-provider'

const leaderboardGridCols =
  'grid min-w-[670px] grid-cols-[minmax(180px,1fr)_100px_130px_130px_130px] items-center relative z-0 text-sm whitespace-nowrap'

type LeaderboardRowProps = {
  isYou?: boolean
  isCard?: boolean
  entry: PerpsLeaderboardEntry & { rank: number }
}

const LeaderboardRow = forwardRef<HTMLDivElement, LeaderboardRowProps>(
  ({ isYou, isCard, entry }, ref) => {
    const {
      state: { sortBy },
    } = useLeaderboardState()
    return (
      <div className={classNames(leaderboardGridCols, 'font-medium')} ref={ref}>
        <div className="py-2 pl-4 px-2">
          <span>
            <span className="text-perps-muted-50 mr-4">{entry.rank}</span>
            {truncateString(entry.address, 10, 'middle')}{' '}
            <span className="text-perps-muted-50">
              {isYou ? '(you)' : null}
            </span>
          </span>
        </div>
        <div className="py-2 text-right px-2">
          <div className="text-perps-muted flex items-center justify-end gap-1">
            {getTier(entry?.seasonVolumeUsd)?.label}
            <div className="w-3 h-3">
              {getTier(entry?.seasonVolumeUsd)?.simpleIcon}
            </div>
          </div>
        </div>
        <div
          className={classNames(
            'py-2 text-right px-2 tabular-nums',
            sortBy === 'volume' && !isCard ? 'bg-perps-muted/[3%]' : '',
          )}
        >
          {formatUSD(entry.volumeUsd)}
        </div>
        <div
          className={classNames(
            'py-2 text-right px-2 tabular-nums',
            sortBy === 'PNL' && !isCard ? 'bg-perps-muted/[3%]' : '',
            getTextColorClass(entry.pnl),
          )}
        >
          {perpsNumberFormatter({ value: entry.pnl, maxFraxDigits: 1 }) ??
            'N/A'}
          %
        </div>
        <div
          className={classNames(
            'py-2 text-right px-2 pr-4 text-[#F853A1] tabular-nums',
            sortBy === 'points' && !isCard ? 'bg-perps-muted/[3%]' : '',
          )}
        >
          {perpsNumberFormatter({ value: entry.points, maxFraxDigits: 0 })}
        </div>
      </div>
    )
  },
)
LeaderboardRow.displayName = 'LeaderboardRow'

export const LeaderboardTable = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const connectedUserSentinelRef = useRef<HTMLDivElement>(null)
  const [isConnectedUserVisible, setIsConnectedUserVisible] = useState(false)
  const {
    state: { sortBy, timeframe },
  } = useLeaderboardState()
  const address = useAccount('evm')
  const { data, isLoading } = useLeaderboard({
    timeframe: TimeframeToPerpsTimeframe[timeframe],
    sortBy,
  })
  const { data: _userData, isLoading: isLoadingUser } = useLeaderboardUser({
    address: address,
    timeframe: TimeframeToPerpsTimeframe[timeframe],
    sortBy,
  })

  const leaderboardData = useMemo(() => {
    if (!data?.entries) return []
    return data?.entries
      ?.slice(3)
      ?.map((entry, idx) => ({ ...entry, rank: idx + 4 }))
  }, [data?.entries])

  const isConnectedUserInTable = useMemo(() => {
    if (!address) return false

    return leaderboardData.some(
      (entry) => entry.address.toLowerCase() === address.toLowerCase(),
    )
  }, [address, leaderboardData])

  const userData = useMemo(() => {
    if (!_userData) return null
    if (_userData.rank <= 3) return null
    const userInLeaderboard = leaderboardData?.find(
      (entry) =>
        entry.address.toLowerCase() === _userData.address.toLowerCase(),
    )

    if (userInLeaderboard) {
      return userInLeaderboard
    }
    return _userData
  }, [_userData, leaderboardData])

  useEffect(() => {
    if (isLoading || !isConnectedUserInTable) {
      setIsConnectedUserVisible(false)
      return
    }

    const scrollEl = scrollRef.current
    const sentinelEl = connectedUserSentinelRef.current

    if (!scrollEl || !sentinelEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsConnectedUserVisible(entry.isIntersecting)
      },
      {
        root: scrollEl,
        threshold: 0,
      },
    )

    observer.observe(sentinelEl)

    return () => observer.disconnect()
  }, [isLoading, isConnectedUserInTable])

  return (
    <div>
      <PerpsCard rounded="xl">
        <div
          ref={scrollRef}
          className="relative max-h-[250px] overflow-auto hide-scrollbar rounded-xl"
        >
          <div
            className={classNames(
              leaderboardGridCols,
              'sticky top-0 z-20 text-sm  backdrop-blur-3xl whitespace-nowrap',
            )}
          >
            <div className="py-2 pl-4 font-normal px-2">User</div>
            <div className="py-2 text-right font-normal px-2">Tier</div>
            <div
              className={classNames(
                'py-2 text-right font-normal px-2',
                sortBy === 'volume' ? 'bg-perps-muted/[3%]' : '',
              )}
            >
              Volume
            </div>
            <div
              className={classNames(
                'py-2 text-right font-normal px-2',
                sortBy === 'PNL' ? 'bg-perps-muted/[3%]' : '',
              )}
            >
              PNL
            </div>
            <div
              className={classNames(
                'py-2 pr-4 text-right font-normal px-2',
                sortBy === 'points' ? 'bg-perps-muted/[3%]' : '',
              )}
            >
              Points
            </div>
          </div>

          {isLoading ? (
            Array(10)
              .fill(null)
              .map((_, idx) => <SkeletonRow key={idx} />)
          ) : !leaderboardData?.length ? (
            <div className="py-4 text-center text-sm italic text-perps-muted-50 h-[200px] flex items-center justify-center">
              No data for the selected timeframe
            </div>
          ) : (
            leaderboardData?.map((entry) => {
              const isYou =
                address?.toLowerCase() === entry.address?.toLowerCase()

              return (
                <LeaderboardRow
                  key={entry.address}
                  ref={isYou ? connectedUserSentinelRef : undefined}
                  entry={entry}
                  isYou={isYou}
                />
              )
            })
          )}
        </div>
      </PerpsCard>
      <div className="mt-2 min-h-[44px]">
        <AnimatePresence initial={false}>
          {!isConnectedUserVisible && address && userData ? (
            <motion.div
              key="connected-user-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="mt-2"
            >
              <PerpsCard
                rounded="xl"
                className="py-0.5 overflow-x-auto hide-scrollbar"
              >
                {isLoadingUser ? (
                  <SkeletonRow />
                ) : (
                  <LeaderboardRow entry={userData} isYou isCard />
                )}
              </PerpsCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

const SkeletonRow = () => {
  return (
    <div
      className={classNames(
        leaderboardGridCols,
        'animate-pulse bg-perps-muted/[3%] rounded-md  py-2',
      )}
    >
      <SkeletonBox className="w-[120px] h-5 ml-4" />
      <SkeletonBox className="w-[80px] h-5 mx-auto" />
      <SkeletonBox className="w-[60px] h-5 mx-auto" />
      <SkeletonBox className="w-[60px] h-5 mx-auto" />
      <SkeletonBox className="w-[60px] h-5 mx-auto" />
    </div>
  )
}
