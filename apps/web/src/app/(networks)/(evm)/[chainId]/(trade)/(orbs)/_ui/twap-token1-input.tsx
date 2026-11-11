'use client'

import { useDstTokenPanel } from '@orbs-network/spot-react'
import { SwapInputLabel } from 'src/app/(networks)/(evm)/[chainId]/(trade)/_ui/swap-input-label'
import type { SupportedChainId } from 'src/config'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import { type EvmChainId, isEvmWNativeSupported } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { formatDecimals } from './helper'

export const TwapToken1Input = () => {
  const { value } = useDstTokenPanel()

  const {
    state: { chainId, token1 },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateSimpleSwap<SupportedChainId & EvmChainId>()

  return (
    <CurrencyInput
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-4 bg-muted rounded-2xl"
      value={formatDecimals(value ?? '', 6)}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isEvmWNativeSupported(chainId)}
      label={<SwapInputLabel chainId={chainId} type="OUTPUT" />}
    />
  )
}
