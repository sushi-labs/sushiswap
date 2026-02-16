'use client'

import { SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import type { XSwapSupportedChainId } from 'src/config'

export function CrossChainSwapSettingsOverlay() {
  return <SettingsOverlay modules={[SettingsModule.SlippageTolerance]} />
}
