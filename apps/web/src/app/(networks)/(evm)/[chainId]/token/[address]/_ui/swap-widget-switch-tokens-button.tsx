'use client'

import { SwapEventName } from '@sushiswap/telemetry'
import { SwitchTokensButton } from 'src/lib/components/switch-tokens-button'
import { useDerivedStateSwapWidget } from './derivedstate-swap-widget-provider'

export function SwapWidgetSwitchTokensButton(): React.JSX.Element {
  const {
    mutate: { switchTokens },
  } = useDerivedStateSwapWidget()

  return (
    <SwitchTokensButton
      onClick={switchTokens}
      event={SwapEventName.SWAP_TOKENS_REVERSED}
    />
  )
}
