import { EvmChainId } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import {
  useDerivedStateCrossChainSwap,
  useSimulateBridgeTx,
} from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountOut = ({ isLoading = false }: { isLoading?: boolean }) => {
  const { state, mutate } = useDerivedStateCrossChainSwap()

  const { data: simulateBridgeTx, isLoading: isLoadingSimulateBridgeTx } =
    useSimulateBridgeTx()

  console.log('amount out state.token1', state.token1)
  return (
    <TokenInput
      className="border border-accent"
      amount={simulateBridgeTx?.amountMinReceived ?? '0'}
      setAmount={() => {}}
      networks={[KvmChainId.KADENA, EvmChainId.ETHEREUM]}
      type="output"
      currency={state?.token1}
      setToken={(token) => {
        console.log('calling setToken1 in token input', token)
        mutate?.setToken1(token)
      }}
      label="Buy"
      isLoadingAmount={isLoading || isLoadingSimulateBridgeTx}
    />
  )
}
