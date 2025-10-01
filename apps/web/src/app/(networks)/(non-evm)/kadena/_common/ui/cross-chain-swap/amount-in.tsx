import { useDebounce } from '@sushiswap/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Amount } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { TokenInput } from './token-input'

export const AmountIn = () => {
  const { state, mutate } = useDerivedStateCrossChainSwap()
  const queryClient = useQueryClient()

  const [amountIn, setAmountIn] = useState<string | undefined>(
    state?.swapAmountString,
  )

  const debouncedAmountIn = useDebounce<string | undefined>(amountIn, 250)

  useEffect(() => {
    if (debouncedAmountIn && state?.token0) {
      const parsed = Amount.fromHuman(state.token0, debouncedAmountIn)
      mutate?.setSwapAmount(parsed.toString())
    } else {
      mutate?.setSwapAmount('')
      queryClient.invalidateQueries({
        queryKey: ['simulate-bridge-tx'],
        exact: false,
      })
    }
  }, [debouncedAmountIn, state?.token0, mutate, queryClient])

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
