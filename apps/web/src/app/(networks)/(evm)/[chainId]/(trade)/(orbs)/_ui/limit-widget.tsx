import { SimpleSwapTokenNotFoundDialog } from '../../swap/_ui/simple-swap-token-not-found-dialog'
import { LimitErrors } from './limit-errors'
import { LimitEstPnl } from './limit-est-pnl'
import { LimitExpiryInputV2 } from './limit-expiry-input-v2'
import { LimitPriceInputV2 } from './limit-price-input-v2'
// import { OrbsBanner } from "./orbs-banner";
// import { TwapOrdersDialogTriggerButton } from "./twap-orders-dialog";
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapToken1Input } from './twap-token1-input'
import { TwapTradeButton } from './twap-trade-button'

export const LimitWidget = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <LimitPriceInputV2 />
        <div className="flex flex-col gap-4">
          <TwapToken0Input />
          <TwapSwitchTokensButton />
          <TwapToken1Input />
        </div>
        <div className="flex items-center pt-2 pb-6 justify-between gap-2">
          <LimitExpiryInputV2 />
          <LimitEstPnl />
        </div>
        <TwapTradeButton />
      </div>
      <LimitErrors />
      {/* <TwapOrdersDialogTriggerButton /> */}
      {/* <OrbsBanner /> */}
      <SimpleSwapTokenNotFoundDialog />
    </div>
  )
}
