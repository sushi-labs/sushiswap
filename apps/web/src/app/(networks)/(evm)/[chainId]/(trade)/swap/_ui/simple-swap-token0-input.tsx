'use client'

import { SwapInputLabel } from 'src/app/(networks)/(evm)/[chainId]/(trade)/_ui/swap-input-label'
import { isTokenSelectorPair } from 'src/lib/wagmi/components/token-selector/selection'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { isWNativeSupported } from 'sushi'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapToken0Input = () => {
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0, setTokens },
    isToken0Loading: isLoading,
  } = useDerivedStateSimpleSwap()

  return (
    <CurrencyInput
      id="swap-from"
      type="INPUT"
      className="border border-accent p-4 bg-muted rounded-2xl"
      chainId={chainId}
      onSelect={(selection) =>
        isTokenSelectorPair(selection)
          ? setTokens(...selection)
          : setToken0(selection)
      }
      allowPairSelection
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      loading={isLoading}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label={<SwapInputLabel chainId={chainId} type="INPUT" />}
    />
  )
}
