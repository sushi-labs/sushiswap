import { type ComponentProps, useEffect } from 'react'
import { formatUnitsForInput } from '~kadena/_common/lib/utils/formatters'
import { TokenInput } from '~kadena/_common/ui/Input/TokenInput'
import { usePoolDispatch, usePoolState } from '../pool-provider'

export const AmountInToken1 = ({
  theme = 'default',
  disabled = false,
}: {
  theme?: ComponentProps<typeof TokenInput>['theme']
  disabled?: boolean
}) => {
  const { token0, token1, amountInToken1, poolId, inputField } = usePoolState()
  const { setToken1, setAmountInToken1, setAmountInToken0, setInputField } =
    usePoolDispatch()

  const pairExists = !!poolId

  const rateOfToken0 = '0.234'

  useEffect(() => {
    if (inputField === 'token0') {
      return
    }
    if (pairExists && amountInToken1 === '') {
      setAmountInToken0('')
      return
    }
    if (pairExists && rateOfToken0 && token0) {
      const amountFormatted = formatUnitsForInput(
        rateOfToken0,
        token0?.tokenDecimals,
      )
      if (amountFormatted) {
        setAmountInToken0(amountFormatted)
      } else {
        setAmountInToken0('')
      }
    }
  }, [amountInToken1, pairExists, token0, inputField, setAmountInToken0])

  const setAmount = (amount: string) => {
    setInputField('token1')
    setAmountInToken1(amount)
  }

  return (
    <TokenInput
      theme={theme}
      type="input"
      amount={amountInToken1}
      setAmount={setAmount}
      currency={token1}
      setToken={disabled ? undefined : setToken1}
    />
  )
}
