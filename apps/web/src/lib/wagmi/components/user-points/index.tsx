import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  LinkInternal,
  RollingNumber,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useUserStats } from 'src/lib/hooks/react-query/leaderboard/use-user-stats'
import { useTierUi } from 'src/lib/leaderboard/tiers'
import { useAccount } from 'wagmi'
import { ProgressBar } from '~evm/leaderboard/_ui/user-tier/progress-bar'
import { TierIcon } from '~evm/leaderboard/_ui/user-tier/tier-icon'

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})
export const UserPoints = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { address } = useAccount()
  const {
    data: userStats,
    isLoading,
    isError,
  } = useUserStats({
    address: address,
    enabled: Boolean(address),
  })
  const tierData = useMemo(
    () => useTierUi(userStats?.totalPoints ?? 0),
    [userStats?.totalPoints],
  )

  if (!address) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger disabled={isLoading || isError} asChild>
        <button
          type="button"
          className="relative flex items-center justify-center h-[40px] px-0.5 rounded-xl overflow-hidden"
        >
          {/* rotating "border" */}
          <div
            className={classNames(
              'absolute w-[200%] lg:w-[300%] h-[200%] lg:h-[300%]',
              'animate-[spin_4s_linear_infinite]',
              'bg-[conic-gradient(from_90deg_at_50%_50%,_rgba(204,204,204,0.5)_0deg,_rgba(255,255,255,0)_54deg,_rgba(255,255,255,0)_270deg,_rgba(204,204,204,0.5)_360deg)]',
            )}
          />
          <div className="relative z-10 h-[36px] flex items-center gap-2 bg-[rgb(233,234,236)] dark:bg-[rgb(29,32,49)] rounded-[10px] px-2 text-sm font-medium">
            {/* shimmer */}
            <div className="z-[9] transition-all absolute inset-0 overflow-hidden p-4 before:absolute before:inset-0 before:rotate-[-90deg] before:blur-sm lg:before:blur-md before:-translate-x-full before:animate-[shimmer_4s_infinite] before:direction-alternate before:bg-gradient-to-r before:from-transparent before:via-white before:dark:via-[#FFFFFF1A] before:to-transparent" />
            {isError ? (
              '-'
            ) : isLoading ? (
              <>
                <SkeletonBox className="w-5 h-5 min-w-[20px]  z-[11]" />
                <SkeletonBox className="w-[60px] h-5 min-w-[60px] hidden lg:block z-[11]" />
              </>
            ) : (
              <>
                <div
                  className={classNames(
                    'relative z-[11] min-w-[20px] w-[20px] h-5 rounded-sm flex items-center justify-center',
                    tierData.currentTier.accent.bgClass,
                  )}
                >
                  <TierIcon tier={tierData.currentTier.icon} />
                </div>
                <div className="hidden lg:block relative z-[11] whitespace-nowrap">
                  <RollingNumber
                    willChange
                    isolate
                    format={{
                      maximumFractionDigits: 0,
                    }}
                    shouldNotAnimateFirstRender={true}
                    value={userStats?.totalPoints ?? 0}
                  />{' '}
                  pts
                </div>
              </>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup className="px-3 py-2 min-w-[274px]">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={classNames(
                    'min-w-[32px] w-[32px] h-8 rounded-md flex items-center justify-center',
                    tierData.currentTier.accent.bgClass,
                  )}
                >
                  <TierIcon tier={tierData.currentTier.icon} />
                </div>
                <div className="flex flex-col uppercase w-full">
                  <p className="text-muted-foreground text-xs">Your Tier</p>
                  <p className="font-bold text-sm">
                    {tierData.currentTier.name}
                  </p>
                </div>
              </div>
              <LinkInternal
                onClick={() => {
                  setOpen(false)
                }}
                href={
                  pathname === '/leaderboard'
                    ? '/leaderboard#leaderboard-table'
                    : '/leaderboard'
                }
                className="text-blue font-medium text-xs whitespace-nowrap"
              >
                View Leaderboard
              </LinkInternal>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col uppercase">
                <p className="text-muted-foreground text-xs">Points</p>
                <p className="font-bold text-sm">
                  {formatter.format(userStats?.totalPoints ?? 0)}
                </p>
              </div>
              <div className="flex flex-col uppercase">
                <p className="text-muted-foreground text-xs">Rank</p>
                <p className="font-bold text-sm">
                  #{userStats?.stats?.[0]?.rank ?? ' -'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground uppercase font-medium">
                {formatter.format(
                  (tierData.nextTier?.minPoints ?? 0) -
                    (userStats?.totalPoints ?? 0),
                )}{' '}
                pts to {tierData.nextTier?.name ?? 'next tier'}
              </p>
              <ProgressBar
                current={userStats?.totalPoints ?? 0}
                target={tierData.nextTier?.minPoints ?? 0}
              />
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
