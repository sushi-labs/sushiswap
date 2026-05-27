import { SkeletonBox, classNames } from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { useLeaderboardState } from './leaderboard-provider'

const CONNECTED_USER_RANK = 36

const leaderboardGridCols =
  'grid min-w-[670px] grid-cols-[minmax(180px,1fr)_100px_130px_130px_130px] items-center relative z-0 text-sm whitespace-nowrap'

type LeaderboardRowProps = {
  rank: number
  isYou?: boolean
  isCard?: boolean
}

const LeaderboardRow = forwardRef<HTMLDivElement, LeaderboardRowProps>(
  ({ rank, isYou, isCard }, ref) => {
    const {
      state: { sortBy },
    } = useLeaderboardState()
    return (
      <div
        className={classNames(leaderboardGridCols)}
        ref={isYou ? ref : undefined}
      >
        <div className="py-2 pl-4 px-2">
          {/* {isYou ? <div ref={ref} className="h-px w-px" /> : null} */}
          <span>
            {rank} 0x123...abc {isYou ? '(You)' : null}
          </span>
        </div>
        <div className="py-2 text-right px-2">legend tier</div>
        <div
          className={classNames(
            'py-2 text-right px-2',
            sortBy === 'volume' && !isCard ? 'bg-perps-muted/[3%]' : '',
          )}
        >
          $1,000
        </div>
        <div
          className={classNames(
            'py-2 text-right px-2',
            sortBy === 'PNL' && !isCard ? 'bg-perps-muted/[3%]' : '',
          )}
        >
          500%
        </div>
        <div
          className={classNames(
            'py-2 text-right px-2 pr-4',
            sortBy === 'points' && !isCard ? 'bg-perps-muted/[3%]' : '',
          )}
        >
          1001
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
    state: { sortBy },
  } = useLeaderboardState()
  const isLoading = false

  const isYou = (rank: number) => rank === CONNECTED_USER_RANK

  useEffect(() => {
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
  }, [])

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

          {isLoading
            ? Array(10)
                .fill(null)
                .map((_, idx) => <SkeletonRow key={idx} />)
            : Array(50)
                .fill(null)
                .map((_, idx) => {
                  const rank = idx + 1
                  const connectedUser = isYou(rank)

                  return (
                    <LeaderboardRow
                      key={rank}
                      ref={connectedUser ? connectedUserSentinelRef : undefined}
                      rank={rank}
                      isYou={connectedUser}
                    />
                  )
                })}
        </div>
      </PerpsCard>
      <div className="mt-2 min-h-[44px]">
        <AnimatePresence initial={false}>
          {!isConnectedUserVisible ? (
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
                {isLoading ? (
                  <SkeletonRow />
                ) : (
                  <LeaderboardRow rank={CONNECTED_USER_RANK} isYou isCard />
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
