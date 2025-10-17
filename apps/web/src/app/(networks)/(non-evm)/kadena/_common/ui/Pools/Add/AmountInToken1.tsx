import { type ComponentProps, useEffect } from 'react'
import { Amount } from 'sushi'
import { TokenInput } from '~kadena/_common/ui/Input/TokenInput'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'

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
    isTxnPending,
  } = usePoolState()
  const { setToken1, setAmountInToken1, setAmountInToken0, setInputField } =
    usePoolDispatch()

  const pairExists = Boolean(poolId)

  const rateOfToken0 = rateOfToken0ToToken1 ?? 0

  useEffect(() => {
    if (inputField === 'token0') {
      return
    }
    if (pairExists && amountInToken1 === '') {
      setAmountInToken0('')
      return
    }
    if (pairExists && rateOfToken0 !== undefined && token0) {
      const parsedAmount = Number.parseFloat(amountInToken1)

      if (Number.isNaN(parsedAmount)) {
        setAmountInToken0('')
        return
      }

      const amountFormatted = Number(rateOfToken0) * Number(parsedAmount)

      if (amountFormatted) {
        const amount = Amount.fromHuman(token0, amountFormatted).toString({
          fixed: token0.decimals,
        })

        setAmountInToken0(amount)
      } else {
        setAmountInToken0('')
      }
    }
  }, [
    amountInToken1,
    pairExists,
    token0,
    inputField,
    setAmountInToken0,
    rateOfToken0,
  ])

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
      isTxnPending={isTxnPending}
    />
  )
}
