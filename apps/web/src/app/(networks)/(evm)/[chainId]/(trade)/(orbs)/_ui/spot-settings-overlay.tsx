'use client'

import type { SettingsModule } from '@sushiswap/ui'
import { SettingsOverlay } from '@sushiswap/ui'

export function SpotSettingsOverlay() {
  return <SettingsOverlay modules={['PriceProtection' as SettingsModule]} />
}
