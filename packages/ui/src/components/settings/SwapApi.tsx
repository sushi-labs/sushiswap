'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import React, { FC } from 'react'

import { Label } from '../label'
import { Switch } from '../switch'
import { typographyVariants } from '../typography'

export const SwapApi: FC = () => {
  const [swapApi, setSwapApi] = useLocalStorage('swapApi', true)

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Swap API</Label>
          <span
            className={typographyVariants({
              variant: 'muted',
              className: 'text-sm',
            })}
          >
            Switch to the client for trade discovery by deactivating the Swap
            API.
          </span>
        </div>
        <Switch
          checked={swapApi}
          onCheckedChange={(checked) => setSwapApi(checked)}
        />
      </div>
    </div>
  )
}
