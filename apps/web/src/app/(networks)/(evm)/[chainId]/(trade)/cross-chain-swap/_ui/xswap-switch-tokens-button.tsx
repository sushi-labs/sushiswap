'use client'

import { SwapEventName } from '@sushiswap/telemetry'
import { SwitchTokensButton } from 'src/lib/components/switch-tokens-button'
import { useXSwapForm } from './xswap-form-provider'

export function XSwapSwitchTokensButton(): React.JSX.Element {
  const { switchTokens, token0Param, token1Param } = useXSwapForm()

  return (
    <SwitchTokensButton
      onClick={switchTokens}
      event={SwapEventName.XSWAP_TOKENS_REVERSED}
      disabled={!token0Param || !token1Param}
    />
  )
}
