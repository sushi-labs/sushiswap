'use client'

import { ChartBarIcon, CogIcon, HomeIcon } from '@heroicons/react/24/outline'
import { useIsMounted } from '@sushiswap/hooks'
import type { StyroResults } from '@sushiswap/styro-client'
import { classNames, useBreakpoint } from '@sushiswap/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TeamSwitcher } from './team-switcher'

interface DashboardEntry {
  children: React.ReactNode
  selected?: boolean
  href: string
}

function DashboardEntry({ children, selected = false, href }: DashboardEntry) {
  return (
    <Link href={href}>
      <div
        className={classNames(
          selected ? 'bg-accent' : 'hover:bg-muted',
          'py-1.5 px-2.5 lg:px-3 lg:py-3 rounded-xl flex flex-row gap-x-2 lg:gap-x-4 font-medium items-center text-sm lg:text-base',
        )}
      >
        {children}
      </div>
    </Link>
  )
}

export function DashboardSidebar({
  team,
}: {
  team: StyroResults['getTeamsTeamId']['data']['team']
}) {
  const pathname = usePathname()

  const isMounted = useIsMounted()
  const iconSize = !useBreakpoint('lg').isLg && isMounted ? 24 : 28

  return (
    <div className="bg-secondary gap-2 lg:gap-6 items-center lg:items-stretch flex flex-row-reverse justify-between lg:justify-start lg:flex-col px-4 min-w-[240px] py-2 lg:py-4">
      <TeamSwitcher currentTeam={team} />
      <div className="flex flex-row lg:flex-col gap-x-1 sm:gap-x-2 md:gap-x-4 gap-y-4 overflow-x-auto">
        <DashboardEntry
          selected={pathname === `/portal/dashboard/${team.id}`}
          href={`/portal/dashboard/${team.id}`}
        >
          <HomeIcon
            className="hidden sm:block"
            width={iconSize}
            height={iconSize}
          />
          <span>Dashboard</span>
        </DashboardEntry>
        <DashboardEntry
          selected={pathname.startsWith(
            `/portal/dashboard/${team.id}/statistics`,
          )}
          href={`/portal/dashboard/${team.id}/statistics`}
        >
          <ChartBarIcon
            className="hidden sm:block"
            width={iconSize}
            height={iconSize}
          />
          <span>Statistics</span>
        </DashboardEntry>
        <DashboardEntry
          selected={pathname.startsWith(
            `/portal/dashboard/${team.id}/settings`,
          )}
          href={`/portal/dashboard/${team.id}/settings`}
        >
          <CogIcon
            className="hidden sm:block"
            width={iconSize}
            height={iconSize}
          />
          <span>Settings</span>
        </DashboardEntry>
      </div>
    </div>
  )
}
