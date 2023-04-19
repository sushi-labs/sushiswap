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
    <div className="border border-slate-700/60 rounded-lg p-4 !h-fit">
      <div className="flex gap-2 items-center">
        <div className={classNames('rounded-sm w-2 h-2', type.color)} />
        <span className="text-xs text-slate-400">{type.title}</span>
      </div>
      <h3 className="mt-2">{title}</h3>
      <p className="mt-3 line-clamp-3 text-xs text-slate-500">{description}</p>
      {isActive && (
        <div className="mt-3 bg-[#243C2E] rounded-full px-2 h-6 flex items-center text-[#34D399] text-xs w-fit">
          Active
        </div>
      )}
    </div>
  )
}
