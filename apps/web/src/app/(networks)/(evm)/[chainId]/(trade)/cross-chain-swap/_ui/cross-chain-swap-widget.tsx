import { Message } from '@sushiswap/ui'
import { useParams, useSearchParams } from 'next/navigation'
import { getWidgetMode } from './get-widget-mode'
import { CrossChainSwapTokenNotFoundDialog } from './lifi/token-not-found-dialog'
import { CrossChainSwapToken0Input } from './lifi/token0-input'
import { CrossChainSwapToken1Input } from './lifi/token1-input'
import { CrossChainSwapTradeButton } from './lifi/trade-button'
import { CrossChainSwapTradeStats } from './lifi/trade-stats'
import { NearIntentsCrossChainSwapWidget } from './near-intents/cross-chain-swap-widget'
import { XSwapSwitchTokensButton } from './xswap-switch-tokens-button'
import { XSwapWidgetFrame } from './xswap-widget-frame'

export function CrossChainSwapWidget() {
  const params = useParams<{ chainId: string }>()
  const searchParams = useSearchParams()
  const chainId0 = Number(params.chainId)
  const chainId1 = Number(searchParams.get('chainId1'))

  const mode = getWidgetMode(chainId0, chainId1)

  if (mode === 'unsupported') {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <Message size="sm" className="!p-4">
          This cross-chain pair is not currently supported. Stellar pairs are
          only available against EVM chains routed through NEAR Intents; other
          pairs require both chains to be supported by LiFi.
        </Message>
      </div>
    )
  }

  if (mode === 'near-intents') {
    return <NearIntentsCrossChainSwapWidget />
  }

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
