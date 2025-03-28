import { useEffect } from 'react'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountIn = () => {
  const { token0, amountIn } = useSwapState()
  const { setToken0, setAmountIn, setAmountOut } = useSwapDispatch()
  // const debouncedAmountIn = useDebounce(amountIn, 500)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  useEffect(() => {
    const _amountIn = Number(amountIn)
    if (_amountIn === 0 || Number.isNaN(_amountIn)) {
      setAmountOut('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountIn])

  return (
    <TokenInput
      className="border border-accent"
      type="input"
      amount={amountIn}
      setAmount={(amount) => {
        setAmountIn(amount)

        const amountOut = Number(amount) * 1.5
        const formatted = amountOut.toString()

        if (formatted.includes('e') || formatted.includes('E')) {
          setAmountOut('')
        } else {
          setAmountOut(formatted)
        }
      }}
      currency={token0}
      setToken={setToken0}
      label="Sell"
    />
  )
}
