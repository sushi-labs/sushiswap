'use client'

import { Button, type ButtonProps, Dots } from '@sushiswap/ui'
import { useMemo } from 'react'
import { type Amount, type IDFor, ZERO } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import { useAmountBalances } from '~evm/_common/ui/balance-provider/use-balances'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

type AmountsProps<TChainId extends BalanceChainId = EvmChainId> =
  ButtonProps & {
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

function Amounts<TChainId extends BalanceChainId>({
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

  const { data: balances, isError } = useAmountBalances(chainId, currencies)
  const { refetchChain } = useRefetchBalances()
  const balanceState = isError ? 'unavailable' : balances ? 'known' : 'loading'

  const sufficientBalance = useMemo(() => {
    return amounts.every((amount) => {
      if (!amount) return true

      const balance = balances?.get(amount.currency.id as IDFor<TChainId, true>)

      return balance !== undefined && !balance.lt(amount)
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

  if (balanceState === 'loading')
    return (
      <Button
        id="amount-checker"
        disabled={true}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        Checking Balance
        <Dots />
      </Button>
    )

  if (balanceState === 'unavailable')
    return (
      <Button
        id="amount-checker"
        fullWidth={fullWidth}
        size={size}
        {...props}
        onClick={() => {
          if (chainId) refetchChain(chainId)
        }}
      >
        Balance unavailable — Retry
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
