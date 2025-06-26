import { SimpleSwapTokenNotFoundDialog } from '../simple/simple-swap-token-not-found-dialog'
import { SwapModeButtons } from '../swap-mode-buttons'
import { DCAOptionsInput } from './dca-options-input'
import { DCAToken1Input } from './dca-token1-input'
import { OrbsBanner } from './orbs-banner'
import { TwapHeader } from './twap-header'
import { TwapMaintenanceMessage } from './twap-maintenance-message'
import { TwapOrdersDialogTriggerButton } from './twap-orders-dialog'
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapTradeButton } from './twap-trade-button'

export const DCAWidget = () => {
  return (
    <div className="flex flex-col gap-4 p-6 pt-0 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.8)] rounded-3xl">
      <TwapHeader />
      <div className="flex items-center justify-between">
        <SwapModeButtons />
      </div>
      <TwapMaintenanceMessage />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4">
          <TwapToken0Input />
          <TwapSwitchTokensButton />
          <DCAToken1Input />
        </div>
        <DCAOptionsInput />
        <TwapTradeButton />
      </div>
      <TwapOrdersDialogTriggerButton />
      <OrbsBanner />
      <SimpleSwapTokenNotFoundDialog />
    </div>
  )
}
