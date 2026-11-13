'use client'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { isWNativeSupported } from 'sushi'
import { SwapInputLabel } from '../../../(trade)/_ui/swap-input-label'
import { useDerivedStateSwapWidget } from './derivedstate-swap-widget-provider'

export const SwapWidgetToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
  } = useDerivedStateSwapWidget()

  return (
    <CurrencyInput
      id="swap-from"
      type="INPUT"
      className="border border-accent p-4 bg-muted rounded-2xl"
      chainId={chainId}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      allowNative={isWNativeSupported(chainId)}
      label={<SwapInputLabel chainId={chainId} type="INPUT" />}
    />
  )
}
