'use client'

import { ChartBarIcon, CogIcon, HomeIcon } from '@heroicons/react/24/solid'
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

export function DashboardSidebar({ teamId }: { teamId: string }) {
  const pathname = usePathname()

  console.log(pathname)

  return (
    <div className="bg-secondary space-y-6 flex flex-col px-4 min-w-[240px] pt-4">
      <TeamSwitcher currentTeamId={teamId} />
      <div className="space-y-4 flex flex-col">
        <DashboardEntry
          selected={pathname === `/portal/dashboard/${teamId}`}
          href={`/portal/dashboard/${teamId}`}
        >
          <HomeIcon width={28} height={28} />
          <span>Dashboard</span>
        </DashboardEntry>
        <DashboardEntry
          selected={pathname.startsWith(
            `/portal/dashboard/${teamId}/statistics`,
          )}
          href={`/portal/dashboard/${teamId}/statistics`}
        >
          <ChartBarIcon width={28} height={28} />
          <span>Statistics</span>
        </DashboardEntry>
        <DashboardEntry
          selected={pathname.startsWith(`/portal/dashboard/${teamId}/settings`)}
          href={`/portal/dashboard/${teamId}/settings`}
        >
          <CogIcon width={28} height={28} />
          <span>Settings</span>
        </DashboardEntry>
      </div>
    </div>
  )
}
