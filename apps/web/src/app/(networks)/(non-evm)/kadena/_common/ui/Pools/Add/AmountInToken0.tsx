import { type ComponentProps, useEffect } from 'react'
import { formatUnitsForInput } from '~kadena/_common/lib/utils/formatters'
import { TokenInput } from '~kadena/_common/ui/Input/TokenInput'
import { usePoolDispatch, usePoolState } from '../pool-provider'

export const AmountInToken0 = ({
  theme = 'default',
  disabled = false,
}: {
  theme?: ComponentProps<typeof TokenInput>['theme']
  disabled?: boolean
}) => {
  const { token0, token1, amountInToken0, poolId, inputField } = usePoolState()
  const { setToken0, setAmountInToken0, setAmountInToken1, setInputField } =
    usePoolDispatch()

  const pairExists = !!poolId

  const rateOfToken1 = '1.5'

  useEffect(() => {
    if (inputField === 'token1') {
      return
    }
    if (pairExists && amountInToken0 === '') {
      setAmountInToken1('')
      return
    }
    if (pairExists && rateOfToken1 && token1) {
      const amountFormatted = formatUnitsForInput(
        rateOfToken1,
        token1?.tokenDecimals,
      )
      if (amountFormatted) {
        setAmountInToken1(amountFormatted)
      } else {
        setAmountInToken1('')
      }
    }
  }, [amountInToken0, pairExists, token1, inputField, setAmountInToken1])

  const setAmount = (amount: string) => {
    setInputField('token0')
    setAmountInToken0(amount)
  }

  return (
    <TokenInput
      theme={theme}
      type="input"
      amount={amountInToken0}
      setAmount={setAmount}
      currency={token0}
      setToken={disabled ? undefined : setToken0}
    />
  )
}
