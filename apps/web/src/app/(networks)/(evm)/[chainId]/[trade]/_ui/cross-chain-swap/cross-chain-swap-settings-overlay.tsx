'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'

export const CrossChainSwapSettingsOverlay = () => {
  return <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
}
