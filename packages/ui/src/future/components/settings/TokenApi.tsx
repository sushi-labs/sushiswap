'use client'

import React, { FC } from 'react'
import { useLocalStorage } from '@sushiswap/hooks'
import Switch from '../Switch'

export const TokenApi: FC = () => {
  const [tokenApi, setTokenApi] = useLocalStorage('tokenApi', true)

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-slate-50">Enable Token API</h1>
          {/* <span className="text-sm text-gray-600 dark:text-slate-500">...</span> */}
        </div>
        <Switch checked={tokenApi} onChange={(checked) => setTokenApi(checked)} />
      </div>
    </div>
  )
}
