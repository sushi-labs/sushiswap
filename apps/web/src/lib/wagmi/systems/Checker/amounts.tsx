'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import { useMemo } from 'react'
import { type Amount, type IDFor, ZERO } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { useAmountBalances } from '~evm/_common/ui/balance-provider/use-balances'

type AmountsProps<
  TChainId extends EvmChainId | SvmChainId = EvmChainId | SvmChainId,
> = ButtonProps & {
  chainId: TChainId | undefined
} & (
    | {
        amounts: (Amount<CurrencyFor<TChainId>> | undefined)[]
        amount?: undefined
      }
    | {
        amounts?: undefined
        amount: Amount<CurrencyFor<TChainId>> | undefined
      }
  )

function Amounts<TChainId extends EvmChainId | SvmChainId>({
  type: _type,
  amounts: _amounts,
  amount,
  chainId,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}: AmountsProps<TChainId>) {
  const amounts = useMemo(() => {
    if (_amounts) return _amounts
    return [amount]
  }, [_amounts, amount])

  const amountsAreDefined = useMemo(
    () => amounts.every((el) => el?.gt(ZERO)),
    [amounts],
  )
  const currencies = useMemo(
    () => amounts.map((amount) => amount?.currency),
    [amounts],
  )

  const { data: balances } = useAmountBalances(chainId, currencies)

  const sufficientBalance = useMemo(() => {
    return amounts?.every((amount) => {
      if (!amount) return true
      return !balances
        ?.get(amount.currency.id as IDFor<TChainId, true>)
        ?.lt(amount)
    })
  }, [amounts, balances])

  if (!amountsAreDefined)
    return (
      <Button
        id="amount-checker"
        disabled={true}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        Enter Amount
      </Button>
    )

  if (!sufficientBalance)
    return (
      <Button
        id="amount-checker"
        disabled={true}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        Insufficient Balance
      </Button>
    )

  return <>{children}</>
}

export { Amounts, type AmountsProps }
