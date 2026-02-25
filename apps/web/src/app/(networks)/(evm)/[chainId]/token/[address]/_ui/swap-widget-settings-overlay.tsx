'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { isSvmChainId } from 'sushi/svm'
import { useDerivedStateSwapWidget } from './derivedstate-swap-widget-provider'

export const SwapWidgetSettingsOverlay = () => {
  const {
    state: { chainId },
  } = useDerivedStateSwapWidget()

  // Jupiter's Ultra API does not support manual slippage adjustment
  if (isSvmChainId(chainId)) {
    return null
  }

  return <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
}
