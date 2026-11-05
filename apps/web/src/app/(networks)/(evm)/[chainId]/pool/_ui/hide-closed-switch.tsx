'use client'

import { Switch } from '@sushiswap/ui'
import type { ReactElement } from 'react'

/** The positions tables' "Hide closed" toggle. */
export function HideClosedSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange(checked: boolean): void
}): ReactElement {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
        Hide closed
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
