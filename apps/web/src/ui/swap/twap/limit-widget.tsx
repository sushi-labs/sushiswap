import { SimpleSwapTokenNotFoundDialog } from '../simple/simple-swap-token-not-found-dialog'
import { SwapModeButtons } from '../swap-mode-buttons'
import { LimitExpirationInput } from './limit-expiration-input'
import { LimitPriceInput } from './limit-price-input'
import { OrbsBanner } from './orbs-banner'
import { TwapHeader } from './twap-header'
import { TwapMaintenanceMessage } from './twap-maintenance-message'
import { TwapOrdersDialogTriggerButton } from './twap-orders-dialog'
import { TwapSettingsOverlay } from './twap-settings-overlay'
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapToken1Input } from './twap-token1-input'
import { TwapTradeButton } from './twap-trade-button'

export const LimitWidget = () => {
  return (
    <div className="flex flex-col gap-4">
      <TwapHeader />
      <div className="flex items-center justify-between">
        <SwapModeButtons />
        <TwapSettingsOverlay />
      </div>
      <TwapMaintenanceMessage />
      <div className="flex flex-col gap-2">
        <LimitPriceInput />
        <div className="flex flex-col gap-4">
          <TwapToken0Input />
          <TwapSwitchTokensButton />
          <TwapToken1Input />
        </div>
        <LimitExpirationInput />
        <TwapTradeButton />
      </div>
      <TwapOrdersDialogTriggerButton />
      <OrbsBanner />
      <SimpleSwapTokenNotFoundDialog />
    </div>
  )
}
