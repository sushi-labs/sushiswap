import { useDebounce } from '@sushiswap/hooks'
import { useEffect } from 'react'
import { useAmountsOut } from '~tron/_common/lib/hooks/useAmountsOut'
import {
  formatUnitsForInput,
  parseUnits,
} from '~tron/_common/lib/utils/formatters'
import { useSwapDispatch, useSwapState } from '~tron/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountIn = () => {
  const { token0, amountIn, token1 } = useSwapState()
  const { setToken0, setAmountIn, setAmountOut } = useSwapDispatch()

  const debouncedAmountIn = useDebounce(amountIn, 500)

  const { data: amountsOut } = useAmountsOut({
    amountIn: parseUnits(debouncedAmountIn, token0.decimals),
  })

  useEffect(() => {
    if (amountsOut && amountsOut?.length !== 0) {
      const _amountOut = formatUnitsForInput(
        amountsOut[amountsOut?.length - 1],
        token1.decimals,
      )
      if (_amountOut === '0') {
        setAmountOut('')
      } else {
        setAmountOut(_amountOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountsOut, token1?.decimals])

  useEffect(() => {
    if (Number(amountIn) === 0) {
      setAmountOut('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountIn])

  return (
    <TokenInput
      type="input"
      amount={amountIn}
      setAmount={setAmountIn}
      token={token0}
      setToken={setToken0}
    />
  )
}