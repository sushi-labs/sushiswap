'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'

export const SimpleSwapSettingsOverlay = () => {
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
