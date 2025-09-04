import { SwapModeButtons } from '~evm/[chainId]/(trade)/_ui/swap-mode-buttons'
import { SimpleSwapTokenNotFoundDialog } from '~evm/[chainId]/(trade)/swap/_ui/simple-swap-token-not-found-dialog'
import { OrbsBanner } from '../../_ui/orbs-banner'
import { TwapMaintenanceMessage } from '../../_ui/twap-maintenance-message'
import { TwapOrdersDialogTriggerButton } from '../../_ui/twap-orders-dialog'
import { TwapSwitchTokensButton } from '../../_ui/twap-switch-tokens-button'
import { TwapToken0Input } from '../../_ui/twap-token0-input'
import { TwapTradeButton } from '../../_ui/twap-trade-button'
import { LimitExpiryInput } from './limit-expiry-input'
import { LimitPriceInput } from './limit-price-input'
import { TwapToken1Input } from './twap-token1-input'

export const LimitWidget = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
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
