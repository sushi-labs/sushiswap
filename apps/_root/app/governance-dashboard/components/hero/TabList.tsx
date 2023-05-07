'use client'

import { Link, classNames } from '@sushiswap/ui'
import React from 'react'
import { usePathname } from 'next/navigation'

const TABS = [
  { title: 'Overview', path: '/governance-dashboard' },
  { title: 'Finance', path: '/governance-dashboard/finance' },
  { title: 'Governance', path: '/governance-dashboard/governance' },
  { title: 'Token Holders', path: '/governance-dashboard/token-holders' },
]

export function TabList() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-8">
      {TABS.map((tab) => (
        <Link.Internal key={tab.path} href={tab.path}>
          <button
            className={classNames(
              '!border-b-2 pb-4',
              pathname === tab.path
                ? 'border-b-blue font-semibold text-blue'
                : 'border-b-transparent hover:text-slate-50'
            )}
          >
            {tab.title}
          </button>
        </Link.Internal>
      ))}
    </nav>
  )
}
