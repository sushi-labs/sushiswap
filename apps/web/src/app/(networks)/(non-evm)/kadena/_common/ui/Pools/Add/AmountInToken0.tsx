import { type ComponentProps, useEffect } from 'react'
import { Amount } from 'sushi'
import { parseUnits } from 'viem'
import { TokenInput } from '~kadena/_common/ui/Input/TokenInput'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'

export const AmountInToken0 = ({
  theme = 'default',
  disabled = false,
}: {
  theme?: ComponentProps<typeof TokenInput>['theme']
  disabled?: boolean
}) => {
  const {
    token0,
    token1,
    amountInToken0,
    poolId,
    rateOfToken1ToToken0,
    inputField,
    isTxnPending,
  } = usePoolState()
  const { setToken0, setAmountInToken0, setAmountInToken1, setInputField } =
    usePoolDispatch()

  const pairExists = Boolean(poolId)

  const rateOfToken1 = rateOfToken1ToToken0 ?? 0

  useEffect(() => {
    if (inputField === 'token1') return

    if (pairExists && amountInToken0 === '') {
      setAmountInToken1('')
      return
    }

    if (pairExists && rateOfToken1 !== undefined && token1 && token0) {
      const parsedAmount = Number.parseFloat(amountInToken0)
      if (Number.isNaN(parsedAmount)) {
        setAmountInToken1('')
        return
      }
      const amountFormatted = Number(rateOfToken1) * Number(parsedAmount)
      const amount = new Amount(
        token1,
        parseUnits(amountFormatted.toString(), token1.decimals),
      ).toString({
        fixed: token1.decimals,
      })

      setAmountInToken1(amount)
    }
  }, [
    token0,
    amountInToken0,
    pairExists,
    token1,
    inputField,
    setAmountInToken1,
    rateOfToken1,
  ])

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
      isTxnPending={isTxnPending}
    />
  )
}
