'use client'

import type { EdgeConfigValue } from '@vercel/edge-config'
import { type FC, useState } from 'react'
import type { EvmChainId } from 'sushi/chain'
import { type SwapMode, SwapModeButtons } from '../swap-mode-buttons'
import { swapProviders } from './providers'
import type { SwapWidgetSlots } from './types'

interface UniversalSwapSwitchProps {
  defaultMode?: SwapMode
  widgets: {
    [key in SwapMode]: {
      slots: SwapWidgetSlots
      config: EdgeConfigValue
    }
  }
  chainId?: EvmChainId
  defaultToken0?: string
}

export const UniversalSwapSwitch: FC<UniversalSwapSwitchProps> = ({
  defaultMode = 'swap',
  widgets,
  chainId,
  defaultToken0,
}) => {
  const [mode, setMode] = useState<SwapMode>(defaultMode)
  const component = widgets[mode]

  if (!component) return null

  const { slots, config } = component
  const Provider = swapProviders[mode]

  return (
    <Provider config={config} chainId={chainId} defaultToken0={defaultToken0}>
      {
        <div className="flex flex-col gap-4">
          {slots.banner}
          {slots.header}
          <div className="flex items-center justify-between">
            <SwapModeButtons mode={mode} onModeChange={setMode} />
            {slots.settings}
          </div>
          {slots.content}
        </div>
      }
    </Provider>
  )
}
