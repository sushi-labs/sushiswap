'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { isSvmChainId } from 'sushi/svm'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapSettingsOverlay = () => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

  // Jupiter's Ultra API does not support manual slippage adjustment
  if (isSvmChainId(chainId)) {
    return null
  }

  return (
    <SettingsOverlay
      modules={[
        SettingsModule.SlippageTolerance,
        // SettingsModule.ExpertMode,
        // SettingsModule.TransactionDeadline,
        // SettingsModule.CarbonOffset
      ]}
    />
  )
}
