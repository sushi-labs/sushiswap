import { SimpleSwapTokenNotFoundDialog } from '../simple/simple-swap-token-not-found-dialog'
import { SwapModeButtons } from '../swap-mode-buttons'
import { LimitExpiryInput } from './limit-expiry-input'
import { LimitPriceInput } from './limit-price-input'
import { OrbsBanner } from './orbs-banner'
import { TwapMaintenanceMessage } from './twap-maintenance-message'
import { TwapOrdersDialogTriggerButton } from './twap-orders-dialog'
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapToken1Input } from './twap-token1-input'
import { TwapTradeButton } from './twap-trade-button'

export const LimitWidget = () => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.8)] rounded-3xl backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <SwapModeButtons />
      </div>
      <TwapMaintenanceMessage />
      <div className="flex flex-col gap-2">
        <LimitPriceInput />
        <div className="flex flex-col gap-4">
          <TwapToken0Input />
          <TwapSwitchTokensButton />
          <TwapToken1Input />
        </div>
        <LimitExpiryInput />
        <TwapTradeButton />
      </div>
      <TwapOrdersDialogTriggerButton />
      <OrbsBanner />
      <SimpleSwapTokenNotFoundDialog />
    </div>
  )
}
