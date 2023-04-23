import { classNames } from '@sushiswap/ui'
import React, { ReactNode } from 'react'

export function FilterButton(props: { children: ReactNode; isActive: boolean; onClick: () => void }) {
  const { children, isActive, onClick } = props
  return (
    <button
      className={classNames(
        'h-10 rounded-full px-4 text-sm font-medium ring-1 ring-slate-700/40',
        isActive ? 'bg-slate-700/40' : 'hover:bg-slate-700/20'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
