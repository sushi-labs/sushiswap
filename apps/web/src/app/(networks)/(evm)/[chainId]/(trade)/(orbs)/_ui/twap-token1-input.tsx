'use client'

import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { EvmChainId, isEvmWNativeSupported } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { formatDecimals, useDstTokenPanel } from '@orbs-network/spot-react'

export const TwapToken1Input = () => {
  const { value } = useDstTokenPanel()

  const {
    state: { chainId, token1 },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateSimpleSwap()

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
      allowNative={isEvmWNativeSupported(chainId as EvmChainId)}
      label="You're buying"
    />
  )
}
