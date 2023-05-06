'use client'

import { Tab } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import React from 'react'

const TABS = ['Overview', 'Finance', 'Governance', 'Token Holders']

export function TabList() {
  return (
    <Tab.List className="flex gap-8">
      {TABS.map((tab) => (
        <Tab
          key={tab}
          className={({ selected }) =>
            classNames(
              '!border-b-2 pb-4',
              selected ? 'border-b-blue font-semibold text-blue' : 'border-b-transparent hover:text-slate-50'
            )
          }
        >
          {tab}
        </Tab>
      ))}
    </Tab.List>
  )
}
