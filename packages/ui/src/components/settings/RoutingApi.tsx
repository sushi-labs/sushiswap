'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import React, { FC } from 'react'

import { Label } from '../label'
import { Switch } from '../switch'
import { typographyVariants } from '../typography'

export const RoutingApi: FC = () => {
  const [routingApi, setRoutingApi] = useLocalStorage('routingApi', false)

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Routing API</Label>
          <span className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>...</span>
        </div>
        <Switch checked={routingApi} onCheckedChange={(checked) => setRoutingApi(checked)} />
      </div>
      <span className="mt-3 text-xs text-gray-500 dark:text-slate-400 items-center flex font-medium gap-0.5">...</span>
    </div>
  )
}
