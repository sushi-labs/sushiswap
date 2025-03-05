import { type EdgeConfigValue, get } from '@vercel/edge-config'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { LimitMaintenanceMessage } from '../twap/limit-maintenance-message'
import { LimitPanel, TwapContainer } from '../twap/twap'
import type { SwapWidgetSlots } from './types'

export function getLimitEdgeConfig(): Promise<EdgeConfigValue | undefined> {
  return get('limit')
}

export const limitSlots: SwapWidgetSlots = {
  header: <LimitMaintenanceMessage />,
  settings: <SimpleSwapSettingsOverlay />,
  content: <TwapContainer isLimit={true} />,
}
