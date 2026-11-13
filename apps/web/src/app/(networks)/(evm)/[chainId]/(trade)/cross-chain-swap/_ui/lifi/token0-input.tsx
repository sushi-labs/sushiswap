'use client'

import type { LifiXSwapSupportedChainId } from 'src/config'
import { VALUE_TRANSFER_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/value-transfer/types'
import { isWNativeSupported } from 'sushi'
import { SwapInputLabel } from '../../../_ui/swap-input-label'
import { XSwapCurrencyInput } from '../xswap-currency-input'
import { useXSwapForm } from '../xswap-form-provider'
import { useLifiXSwap } from './xswap-provider'

const networks = VALUE_TRANSFER_SUPPORTED_CHAIN_IDS

export function CrossChainSwapToken0Input<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: { swapAmountString, chainId0, token0 },
    mutate: { setSwapAmount, setToken0 },
    isToken0Loading: isLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  const form = useXSwapForm()
  return (
    <XSwapCurrencyInput
      id="swap-from"
      type="INPUT"
      chainId={chainId0}
      onSelect={setToken0}
      value={swapAmountString}
      onChange={setSwapAmount}
      currency={token0}
      loading={isLoading}
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId0)}
      label={<SwapInputLabel chainId={chainId0} type="INPUT" />}
      networks={networks}
      selectedNetwork={chainId0}
      onNetworkChange={form.setChainId0}
    />
  )
}
