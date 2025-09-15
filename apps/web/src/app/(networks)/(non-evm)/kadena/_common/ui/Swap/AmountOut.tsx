import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountOut = ({ isLoading = false }: { isLoading?: boolean }) => {
  const { token1, amountOutString } = useSwapState()
  const { setToken1 } = useSwapDispatch()

  return (
    <TokenInput
      className="border border-accent"
      amount={amountOutString}
      setAmount={() => {}}
      type="output"
      currency={token1}
      setToken={setToken1}
      label="Buy"
      isLoadingAmount={isLoading}
    />
  )
}
