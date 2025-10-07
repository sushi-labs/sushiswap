import { useMemo } from 'react'
import { EvmChainId } from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { TokenInput } from './token-input'

export const AmountOut = ({ isLoading = false }: { isLoading?: boolean }) => {
  const {
    state: {
      simulateBridgeTx,
      token1,
      isLoadingSimulateBridgeTx,
      simulateBridgeError,
      swapAmountString,
    },
  } = useDerivedStateCrossChainSwap()

  const isAllowanceError = useMemo(() => {
    if (
      simulateBridgeError?.message.includes('transfer amount exceeds allowance')
    ) {
      return true
    }
    return false
  }, [simulateBridgeError])

  return (
    <TokenInput
      className="border border-accent"
      amount={
        isAllowanceError
          ? swapAmountString
          : (simulateBridgeTx?.estimatedAmountReceived ?? '')
      }
      setAmount={() => {}}
      networks={[KvmChainId.KADENA, EvmChainId.ETHEREUM]}
      type="output"
      currency={token1}
      label="Buy"
      isLoadingAmount={isLoading || isLoadingSimulateBridgeTx}
    />
  )
}
