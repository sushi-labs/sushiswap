import { CreditCardIcon } from '@heroicons/react/20/solid'
import { Amount, Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import { FC, useCallback } from 'react'

import { CurrencyInputProps } from './CurrencyInput'
import { JSBI } from '@sushiswap/math'

type BalancePanel = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'fundSource' | 'loading'
> & {
  id?: string
  account: string | undefined
  balance: Record<FundSource, Amount<Type>> | undefined
}

const MIN_NATIVE_CURRENCY_FOR_GAS: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BalancePanel: FC<BalancePanel> = ({
  id,
  balance,
  onChange,
  disableMaxButton,
  fundSource = FundSource.WALLET,
  loading,
}) => {
  const [big, portion] = (balance ? `${balance?.[fundSource]?.toSignificant(6)}` : '0.00').split('.')

  const onClick = useCallback(() => {
    if (onChange && balance?.[fundSource]?.greaterThan(0)) {
      if (balance?.[fundSource].currency.isNative && balance?.[fundSource].greaterThan(MIN_NATIVE_CURRENCY_FOR_GAS)) {
        const hundred = Amount.fromRawAmount(
          Native.onChain(balance[fundSource].currency.chainId),
          MIN_NATIVE_CURRENCY_FOR_GAS
        )
        onChange(balance[fundSource].subtract(hundred).toFixed())
      } else {
        onChange(balance?.[fundSource]?.greaterThan(0) ? balance[fundSource].toFixed() : '')
      }
    }
  }, [balance, fundSource, onChange])

  if (loading) {
    return (
      <div className="h-[24px] w-[60px] flex items-center">
        <Skeleton.Box className="bg-white/[0.06] h-[12px] w-full" />
      </div>
    )
  }

  return (
    <button
      data-testid={`${id}-balance-button`}
      type="button"
      onClick={onClick}
      className="font-medium flex gap-1 items-center py-1 text-blue hover:text-blue-600 active:text-blue-700 dark:text-slate-400 hover:dark:text-slate-300 px-2 rounded-md"
      disabled={disableMaxButton}
    >
      <CreditCardIcon width={20} height={20} />
      <span className="text-lg">
        {big}.<span className="text-sm font-semibold">{portion ?? '00'}</span>
      </span>
    </button>
  )
}
