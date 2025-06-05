import { SimpleSwapTokenNotFoundDialog } from '../simple/simple-swap-token-not-found-dialog'
import { DCAOptionsInput } from './dca-options-input'
import { DCAToken1Input } from './dca-token1-input'
import { OrbsBanner } from './orbs-banner'
import { TwapOrdersDialogTriggerButton } from './twap-orders-dialog'
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapTradeButton } from './twap-trade-button'

export const DCAWidget = () => {
  return (
    <div className="flex flex-col gap-4">
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
