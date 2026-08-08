'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { isSvmChainId } from 'sushi/svm'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapSlippage,
} from './derivedstate-simple-swap-provider'

export const SimpleSwapSettingsOverlay = () => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()
  const { autoSlippagePercentage } = useSimpleSwapSlippage()

  // Jupiter's Ultra API does not support manual slippage adjustment
  if (isSvmChainId(chainId)) {
    return null
  }

  return (
    <SettingsOverlay
      options={{
        slippageTolerance: {
          autoValue: autoSlippagePercentage,
        },
      }}
      modules={[
        SettingsModule.SlippageTolerance,
        // SettingsModule.ExpertMode,
        // SettingsModule.TransactionDeadline,
        // SettingsModule.CarbonOffset
      ]}
    />
  )
}
