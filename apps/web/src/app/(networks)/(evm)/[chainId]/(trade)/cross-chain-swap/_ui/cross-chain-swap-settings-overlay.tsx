'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import type { LifiXSwapSupportedChainId } from 'src/config'

export function CrossChainSwapSettingsOverlay() {
  return <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
}
