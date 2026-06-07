'use client'

import { formatDecimals, useDstTokenPanel } from '@orbs-network/spot-react'
import type { SupportedChainId } from 'src/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { type EvmChainId, isEvmWNativeSupported } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'

export const TwapToken1Input = () => {
  const { value } = useDstTokenPanel()

  const {
    state: { chainId, token1 },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateSimpleSwap<SupportedChainId & EvmChainId>()

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      value={formatDecimals(value ?? '', 6)}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isEvmWNativeSupported(chainId)}
      label="You're buying"
    />
  )
}
