import { useDebounce } from '@sushiswap/hooks'
import { useEffect, useMemo, useState } from 'react'
import { Amount } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountIn = () => {
  const { state, mutate } = useDerivedStateCrossChainSwap()

  const [amountIn, setAmountIn] = useState<string | undefined>(
    state?.swapAmountString,
  )

  const debouncedAmountIn = useDebounce<string | undefined>(amountIn, 250)

  // when the debounced value changes, push it to global state
  useEffect(() => {
    if (debouncedAmountIn && state?.token0) {
      const parsed = Amount.fromHuman(state.token0, debouncedAmountIn)
      mutate?.setSwapAmount(parsed.toString())
    }
  }, [debouncedAmountIn, state?.token0, mutate])

  return (
    <TokenInput
      className="border border-accent"
      type="input"
      amount={amountIn ?? ''}
      setAmount={setAmountIn}
      currency={state?.token0}
      setToken={mutate?.setToken0}
      label="Sell"
      isLoadingAmount={false}
      isTxnPending={false}
      networks={[KvmChainId.KADENA, EvmChainId.ETHEREUM]}
    />
  )
}
