import { SimpleSwapTokenNotFoundDialog } from '../simple/simple-swap-token-not-found-dialog'
import { LimitExpiryInput } from './limit-expiry-input'
import { LimitPriceInput } from './limit-price-input'
import { OrbsBanner } from './orbs-banner'
import { TwapOrdersDialogTriggerButton } from './twap-orders-dialog'
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapToken1Input } from './twap-token1-input'
import { TwapTradeButton } from './twap-trade-button'

export const LimitWidget = () => {
  return (
    <div className="flex flex-col gap-4">
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
