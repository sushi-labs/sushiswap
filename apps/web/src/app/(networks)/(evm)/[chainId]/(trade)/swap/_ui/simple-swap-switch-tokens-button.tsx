'use client'

import { SwapEventName } from '@sushiswap/telemetry'
import { SwitchTokensButton } from 'src/lib/components/switch-tokens-button'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export function SimpleSwapSwitchTokensButton(): React.JSX.Element {
  const {
    mutate: { switchTokens },
  } = useDerivedStateSimpleSwap()

  return (
    <SwitchTokensButton
      onClick={switchTokens}
      event={SwapEventName.SWAP_TOKENS_REVERSED}
    />
  )
}
