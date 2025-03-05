import { type EdgeConfigValue, get } from '@vercel/edge-config'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { DCAMaintenanceMessage } from '../twap/dca-maintenance-message'
import { TwapContainer } from '../twap/twap'
import type { SwapWidgetSlots } from './types'

export function getDcaEdgeConfig(): Promise<EdgeConfigValue | undefined> {
  return get('dca')
}

export const dcaSlots: SwapWidgetSlots = {
  header: <DCAMaintenanceMessage />,
  settings: <SimpleSwapSettingsOverlay />,
  content: <TwapContainer isLimit={false} />,
}
