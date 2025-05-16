'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'

export const TwapSettingsOverlay = () => {
  return <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
}
