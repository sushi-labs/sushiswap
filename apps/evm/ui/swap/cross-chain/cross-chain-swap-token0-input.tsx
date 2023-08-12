'use client'

import { Chain } from '@sushiswap/chain'
import { STARGATE_SUPPORTED_CHAIN_IDS, StargateChainId } from '@sushiswap/stargate'
import { Button, Label, NetworkIcon, NetworkSelector, SelectIcon } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useState, useTransition } from 'react'

import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapToken0Input = () => {
  const [value, setValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const {
    state: { swapAmountString, chainId0, token0 },
    mutate: { setSwapAmount, setToken0, setChainId0 },
    isLoading,
  } = useDerivedStateCrossChainSwap()

  const handleChange = (val: string) => {
    setValue(val)
    startTransition(() => {
      setSwapAmount(val)
    })
  }

  return (
    <div className="border border-accent flex flex-col bg-white dark:bg-slate-800 rounded-xl">
      <div className="p-3 border-b border-accent flex gap-2 items-center">
        <Label className="text-xs tracking-tighter text-muted-foreground">Network</Label>
        <NetworkSelector
          networks={STARGATE_SUPPORTED_CHAIN_IDS}
          selected={chainId0 as StargateChainId}
          onSelect={setChainId0}
        >
          <Button variant="secondary" size="xs">
            <NetworkIcon chainId={chainId0} width={16} height={16} />
            {Chain.from(chainId0).name}
            <SelectIcon />
          </Button>
        </NetworkSelector>
      </div>
      <Web3Input.Currency
        id="swap-from"
        type="INPUT"
        className="p-3 bg-white dark:bg-slate-800 rounded-xl"
        chainId={chainId0}
        onSelect={setToken0}
        value={isPending ? value : swapAmountString}
        onChange={handleChange}
        currency={token0}
        loading={isLoading}
        currencyLoading={isLoading}
      />
    </div>
  )
}
