'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'

export const FiatBuySettingsOverlay = () => {
  return <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
}
