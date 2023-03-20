'use client'

import { Tab } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import Container from '@sushiswap/ui/future/components/Container'
import React, { useState } from 'react'

import { Hero } from './components'

const DATE_FILTER = ['month', 'quarter', 'year'] as const
type DateFilterKey = (typeof DATE_FILTER)[number]
type DateFilter = { key: DateFilterKey; title: string }

const FILTERS: DateFilter[] = [
  { key: 'month', title: 'Last Month' },
  { key: 'quarter', title: 'Last Quarter' },
  { key: 'year', title: 'Last Year' },
]

export default function GovernanceDashboard() {
  const [dateFilter, setDateFilter] = useState(FILTERS[0])

  return (
    <Tab.Group>
      <Hero />
      <Container maxWidth="6xl" className="pt-14 mx-auto px-4">
        <Tab.Panels>
          <Tab.Panel>
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">Latest @ Sushi</h2>
                <div className="flex gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      className={classNames(
                        'rounded-full h-10 px-4 ring-1 ring-slate-700/40',
                        dateFilter.key === filter.key ? 'bg-slate-700/40' : 'hover:bg-slate-700/20'
                      )}
                      key={filter.key}
                      onClick={() => setDateFilter(filter)}
                    >
                      {filter.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-6">
                <div>bookmarks</div>
                <div>cards</div>
              </div>
            </section>
          </Tab.Panel>
          <Tab.Panel>2</Tab.Panel>
          <Tab.Panel>3</Tab.Panel>
          <Tab.Panel>4</Tab.Panel>
        </Tab.Panels>
      </Container>
    </Tab.Group>
  )
}
