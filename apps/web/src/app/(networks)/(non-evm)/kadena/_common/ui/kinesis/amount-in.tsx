import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { EvmChainId } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { TokenInput } from './token-input'

export const AmountIn = () => {
  const {
    state: { swapAmountString, token0 },
    mutate: { setSwapAmount, setTokens },
  } = useDerivedStateCrossChainSwap()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!swapAmountString || !token0) {
      setSwapAmount('')
      queryClient.invalidateQueries({
        queryKey: ['simulate-bridge-tx'],
        exact: false,
      })
    }
  }, [swapAmountString, token0, setSwapAmount, queryClient])

  return (
    <TokenInput
      className="border border-accent"
      type="input"
      amount={swapAmountString ?? ''}
      setAmount={setSwapAmount}
      currency={token0}
      setToken={setTokens}
      label="Sell"
      isLoadingAmount={false}
      isTxnPending={false}
      networks={[KvmChainId.KADENA, EvmChainId.ETHEREUM]}
    />
  )
}
