import { EvmChainId } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { TokenInput } from './token-input'

export const AmountOut = ({ isLoading = false }: { isLoading?: boolean }) => {
  const { state, mutate } = useDerivedStateCrossChainSwap()

  return (
    <TokenInput
      className="border border-accent"
      amount={state.simulateBridgeTx?.amountMinReceived ?? ''}
      setAmount={() => {}}
      networks={[KvmChainId.KADENA, EvmChainId.ETHEREUM]}
      type="output"
      currency={state?.token1}
      setToken={(token) => {
        mutate?.setToken1(token)
      }}
      label="Buy"
      isLoadingAmount={isLoading || state.isLoadingSimulateBridgeTx}
    />
  )
}
