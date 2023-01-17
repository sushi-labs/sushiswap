'use client'

import { AppType } from '@sushiswap/ui13/types'
import React, { FC } from 'react'

import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { Tab } from '@sushiswap/ui13/components/tabs'

export const SwitchAppType: FC = () => {
  const { appType } = useSwapState()
  const { setAppType } = useSwapActions()

  return (
    <div>
      <Tab.Group
        defaultIndex={0}
        selectedIndex={appType === AppType.Swap ? 0 : 1}
        onChange={(val) => setAppType(val === 0 ? AppType.Swap : AppType.xSwap)}
      >
        <Tab.List islandClassName="dark:!bg-slate-800" className="dark:!bg-white/[0.04]">
          <Tab className="px-3 font-medium">Same Chain</Tab>
          <Tab className="px-3 font-medium">Cross Chain</Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  )
}
