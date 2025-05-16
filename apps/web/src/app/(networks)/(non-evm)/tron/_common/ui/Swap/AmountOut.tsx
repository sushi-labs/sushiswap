import { useSwapDispatch, useSwapState } from '~tron/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountOut = () => {
  const { token1, amountOut } = useSwapState()
  const { setToken1, setAmountOut } = useSwapDispatch()

  return (
    <TokenInput
      className="p-4 bg-gray-100 dark:bg-slate-900 rounded-xl"
      amount={amountOut}
      setAmount={setAmountOut}
      type="output"
      currency={token1}
      setToken={setToken1}
      label="Buy"
    />
  )
}
