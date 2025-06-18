import { type ComponentProps, useEffect } from 'react'
import { Decimal } from 'sushi/math'
import { formatToMaxDecimals } from '~kadena/_common/lib/utils/formatters'
import { TokenInput } from '~kadena/_common/ui/Input/TokenInput'
import { usePoolDispatch, usePoolState } from '../pool-provider'

export const AmountInToken1 = ({
  theme = 'default',
  disabled = false,
}: {
  theme?: ComponentProps<typeof TokenInput>['theme']
  disabled?: boolean
}) => {
  const {
    token0,
    token1,
    amountInToken1,
    poolId,
    rateOfToken0ToToken1,
    inputField,
  } = usePoolState()
  const { setToken1, setAmountInToken1, setAmountInToken0, setInputField } =
    usePoolDispatch()

  const pairExists = Boolean(poolId)

  const rateOfToken0 = rateOfToken0ToToken1 ?? 0

  // biome-ignore lint/correctness/useExhaustiveDependencies: rateOfToken0 will be defined when the pool exists
  useEffect(() => {
    if (inputField === 'token0') {
      return
    }
    if (pairExists && amountInToken1 === '') {
      setAmountInToken0('')
      return
    }
    if (pairExists && rateOfToken0 && token0) {
      const amountFormatted = new Decimal(rateOfToken0).mul(
        Number.parseFloat(amountInToken1 || '0'),
      )
      if (amountFormatted) {
        setAmountInToken0(
          formatToMaxDecimals(amountFormatted, token0?.tokenDecimals),
        )
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
