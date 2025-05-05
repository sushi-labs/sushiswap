'use client'

import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import type { StyroResults } from '@sushiswap/styro-client'
import { classNames } from '@sushiswap/ui'
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
          'px-3 py-3 rounded-xl flex flex-row space-x-4 font-medium items-center',
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

  return (
    <div className="bg-secondary space-y-6 flex flex-col px-4 min-w-[240px] pt-4">
      <TeamSwitcher currentTeam={team} />
      <div className="space-y-4 flex flex-col">
        <DashboardEntry
          selected={pathname === `/portal/dashboard/${team.id}`}
          href={`/portal/dashboard/${team.id}`}
        >
          <HomeIcon width={28} height={28} />
          <span>Dashboard</span>
        </DashboardEntry>
        {/* <DashboardEntry
          selected={pathname.startsWith(
            `/portal/dashboard/${team.id}/api-keys`,
          )}
          href={`/portal/dashboard/${team.id}/api-keys`}
        >
          <KeyIcon width={28} height={28} />
          <span>Key Management</span>
        </DashboardEntry> */}
        <DashboardEntry
          selected={pathname.startsWith(
            `/portal/dashboard/${team.id}/statistics`,
          )}
          href={`/portal/dashboard/${team.id}/statistics`}
        >
          <ChartBarIcon width={28} height={28} />
          <span>Statistics</span>
        </DashboardEntry>
        <DashboardEntry
          selected={pathname.startsWith(
            `/portal/dashboard/${team.id}/settings`,
          )}
          href={`/portal/dashboard/${team.id}/settings`}
        >
          <CogIcon width={28} height={28} />
          <span>Settings</span>
        </DashboardEntry>
      </div>
    </div>
  )
}
