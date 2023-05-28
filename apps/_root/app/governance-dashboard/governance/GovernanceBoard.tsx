'use client'

import React, { useState } from 'react'

import { GOV_STATUS, GovernanceItem, GovernanceStatus } from '../lib'
import { GovernanceItemCard, GovernanceTypeFilter } from '../components'

export function GovernanceBoard({
  governanceItemsMapping,
}: {
  governanceItemsMapping: Record<'IMPLEMENTATION' | 'PROPOSAL' | 'DISCUSSION', GovernanceItem[]>
}) {
  const [selectedGovType, setSelectedGovType] = useState<GovernanceStatus>('IMPLEMENTATION')

  return (
    <>
      <div className="hidden grid-cols-3 gap-12 md:grid">
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
      <div className="space-y-4 md:hidden">
        <GovernanceTypeFilter selectedGovType={selectedGovType} setSelectedGovType={setSelectedGovType} />
        <div className="grid gap-2">
          {governanceItemsMapping[selectedGovType].map((item, index) => (
            <GovernanceItemCard key={index} {...item} />
          ))}
        </div>
      </div>
    </>
  )
}
