import { Message } from '@sushiswap/ui'
import { getWidgetMode } from './get-widget-mode'
import { LayerZeroCrossChainSwapWidget } from './layerzero/cross-chain-swap-widget'
import { CrossChainSwapTokenNotFoundDialog } from './lifi/token-not-found-dialog'
import { CrossChainSwapToken0Input } from './lifi/token0-input'
import { CrossChainSwapToken1Input } from './lifi/token1-input'
import { CrossChainSwapTradeButton } from './lifi/trade-button'
import { CrossChainSwapTradeStats } from './lifi/trade-stats'
import { NearIntentsCrossChainSwapWidget } from './near-intents/cross-chain-swap-widget'
import { useXSwapForm } from './xswap-form-provider'
import { XSwapSwitchTokensButton } from './xswap-switch-tokens-button'
import { XSwapWidgetFrame } from './xswap-widget-frame'

export function CrossChainSwapWidget() {
  // Use the same source of truth as the quote providers. Native history updates
  // can change the form's network without updating Next's route params.
  const { chainId0, chainId1, token0Param, token1Param } = useXSwapForm()

  const mode = getWidgetMode(
    chainId0,
    chainId1 ?? Number.NaN,
    token0Param,
    token1Param,
  )

  if (mode === 'unsupported') {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <Message size="sm" className="!p-4">
          This cross-chain pair is not currently supported. Stellar pairs are
          available against supported EVM chains through NEAR Intents or
          LayerZero; other pairs require both chains to be supported by LiFi.
        </Message>
      </div>
    )
  }

  if (mode === 'near-intents') {
    return <NearIntentsCrossChainSwapWidget />
  }

  if (mode === 'layerzero') return <LayerZeroCrossChainSwapWidget />

  return (
    <XSwapWidgetFrame>
      <CrossChainSwapToken0Input />
      <XSwapSwitchTokensButton />
      <div className="flex flex-col">
        <CrossChainSwapToken1Input />
        <CrossChainSwapTradeButton />
        <div className="mt-2">
          <CrossChainSwapTradeStats />
        </div>
      </div>
      <CrossChainSwapTokenNotFoundDialog />
    </XSwapWidgetFrame>
  )
}
