import { SwitchTokensButton } from 'src/lib/components/switch-tokens-button'
import { useSimpleSwapActions } from '~aptos/swap/ui/simple/simple-swap-provider/simple-swap-provider'

export function SimpleSwapSwitchTokensButton(): React.JSX.Element {
  const { swapTokens } = useSimpleSwapActions()

  return <SwitchTokensButton onClick={swapTokens} />
}
