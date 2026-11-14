import { SwitchTokensButton } from 'src/lib/components/switch-tokens-button'
import { useSimpleSwapActions } from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'

export function SimpleSwapSwitchTokensButton(): React.JSX.Element {
  const { swapTokens } = useSimpleSwapActions()

  return <SwitchTokensButton onClick={swapTokens} />
}
