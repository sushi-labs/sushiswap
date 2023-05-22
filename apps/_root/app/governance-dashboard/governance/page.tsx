import React from 'react'

import { GovernanceItemCard } from '../components'
import { getLatestGovernanceItems } from '../lib'
import { GOV_STATUS } from '../lib/constants'
import { GovernanceFilters } from './GovernanceFilters'

export default async function Governance({ searchParams }) {
  const governanceItemsMapping = (await getLatestGovernanceItems(searchParams)) ?? []

  return (
    <section className="space-y-10">
      <header className="flex items-center justify-between">
        <h2 className="ml-1 text-2xl font-bold text-slate-200">Governance Board</h2>
        <GovernanceFilters />
      </header>
      <div className="grid grid-cols-3 gap-12">
        {Object.entries(governanceItemsMapping).map(([key, items]) => (
          <div key={key} className="space-y-5">
            <div className="flex items-center gap-2 pl-2.5">
              <div className={`h-3 w-3 rounded-sm ${GOV_STATUS[key].color}`} />
              <h3 className="font-medium">{GOV_STATUS[key].title}</h3>
            </div>

            <div className="grid gap-2">
              {items.map((item, index) => (
                <GovernanceItemCard key={index} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
