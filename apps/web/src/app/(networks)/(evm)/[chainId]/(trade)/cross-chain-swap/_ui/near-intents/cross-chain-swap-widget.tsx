import { XSwapSwitchTokensButton } from '../xswap-switch-tokens-button'
import { XSwapWidgetFrame } from '../xswap-widget-frame'
import { NearIntentsCrossChainSwapToken0Input } from './token0-input'
import { NearIntentsCrossChainSwapToken1Input } from './token1-input'
import { NearIntentsCrossChainSwapTradeButton } from './trade-button'
import { NearIntentsCrossChainSwapTradeStats } from './trade-stats'

export function NearIntentsCrossChainSwapWidget() {
  return (
    <XSwapWidgetFrame>
      <NearIntentsCrossChainSwapToken0Input />
      <XSwapSwitchTokensButton />
      <div className="flex flex-col">
        <NearIntentsCrossChainSwapToken1Input />
        <NearIntentsCrossChainSwapTradeButton />
        <div className="mt-2">
          <NearIntentsCrossChainSwapTradeStats />
        </div>
      </div>
    </XSwapWidgetFrame>
  )
}
