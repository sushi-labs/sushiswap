'use client'

import { classNames } from '@sushiswap/ui'
import React from 'react'

interface GovernanceItem {
  type: {
    id: string
    title: string
    color: string
  }
  title: string
  description: string
  isActive: boolean
  date: number
}

export function GovernanceItemCard(props: GovernanceItem) {
  const { type, title, description, isActive } = props
  return (
    <div className="!h-fit rounded-lg border border-slate-700/60 p-4">
      <div className="flex items-center gap-2">
        <div className={classNames('h-2 w-2 rounded-sm', type.color)} />
        <span className="text-xs text-slate-400">{type.title}</span>
      </div>
      <h3 className="mt-2">{title}</h3>
      <p className="mt-3 text-xs text-slate-500 line-clamp-3">{description}</p>
      {isActive && (
        <div className="mt-3 flex h-6 w-fit items-center rounded-full bg-[#243C2E] px-2 text-xs text-[#34D399]">
          Active
        </div>
      )}
    </div>
  )
}
