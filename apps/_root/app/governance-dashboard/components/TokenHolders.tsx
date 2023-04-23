import React, { useState } from 'react'

import { FilterButton } from './FilterButton'
import { KpiCard } from './KpiCard'

const holderSnapshot = [
  {
    title: 'Community Participants',
    value: '20.12k',
    additional: (
      // TODO: dynamic
      <dd className="text-sm text-green-400">+33.42% from last quarter</dd>
    ),
  },
  {
    title: 'Token Concentration',
    value: '20.12%',
    additional: <dd className="text-sm text-green-400">+33.42% from last quarter</dd>,
  },
  {
    title: 'Token Holders',
    value: '23.4k',
    additional: (
      // TODO: dynamic
      <dd className="text-sm text-red-400">-3.42% from last quarter</dd>
    ),
  },
]

const TOKEN_HOLDER_FILTERS = [1, 1_000, 10_000, 100_000]

export function TokenHolders() {
  const [selectedFilter, setSelectedFilter] = useState(TOKEN_HOLDER_FILTERS[0])
  return (
    <section className="space-y-14">
      <div className="space-y-8">
        <h2 className="pl-1 text-2xl font-bold text-slate-200">Holder Snapshot</h2>
        <div className="grid grid-cols-3 gap-4">{holderSnapshot.map(KpiCard)}</div>
      </div>

      <div className="space-y-8">
        <h2 className="pl-1 text-2xl font-bold text-slate-200">All Holders</h2>
        <div className="space-y-6">
          <div className="flex gap-2">
            {TOKEN_HOLDER_FILTERS.map((filter, index) => (
              <FilterButton
                onClick={() => setSelectedFilter(filter)}
                isActive={selectedFilter === filter}
                key={filter}
              >{`>=${index ? filter / 1000 + 'K' : filter} $SUSHI`}</FilterButton>
            ))}
          </div>
          <div>Table</div>
        </div>
      </div>
    </section>
  )
}
