import { SkeletonText, classNames } from '@sushiswap/ui'
import { type FC, memo, useCallback } from 'react'
import { Amount, Native, type Type } from 'sushi/currency'

import { useIsMounted } from '@sushiswap/hooks'
import type { CurrencyInputProps } from './CurrencyInput'

type BalancePanel = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  id?: string
  account: string | undefined
  balance: Amount<Type> | null | undefined
  type: 'INPUT' | 'OUTPUT'
}

const MIN_NATIVE_CURRENCY_FOR_GAS = 10n ** 16n // .01 ETH

export const BalancePanel: FC<BalancePanel> = memo(function BalancePanel({
  id,
  balance,
  onChange,
  disableMaxButton,
  loading,
  type,
}) {
  const isMounted = useIsMounted()
  const balanceStr = balance ? `${balance?.toSignificant(6)}` : `0`

  const onClick = useCallback(() => {
    if (onChange && balance?.greaterThan(0)) {
      if (
        balance.currency.isNative &&
        balance.greaterThan(MIN_NATIVE_CURRENCY_FOR_GAS)
      ) {
        const hundred = Amount.fromRawAmount(
          Native.onChain(balance.currency.chainId),
          MIN_NATIVE_CURRENCY_FOR_GAS,
        )
        onChange(balance.subtract(hundred).toFixed())
      } else {
        onChange(balance?.greaterThan(0) ? balance.toFixed() : '')
      }
    }
  }, [balance, onChange])

  if (loading || !isMounted) {
    return (
      <div className="w-[60px] flex items-center">
        <SkeletonText fontSize="sm" className="w-full" />
      </div>
    )
  }

  return (
    <button
      id={`${id}-balance-button`}
      testdata-id={`${id}-balance-button`}
      type="button"
      // variant="ghost"
      onClick={onClick}
      className={classNames(
        type === 'INPUT'
          ? 'text-blue hover:text-blue-600 active:text-blue-700 dark:text-skyblue hover:dark:text-skyblue-600 active:dark:text-skyblue-700'
          : 'text-muted-foreground dark:text-pink-200',
        'text-sm font-medium flex gap-1 items-center rounded-md',
      )}
      disabled={disableMaxButton}
    >
      Balance: {balanceStr} {balance?.currency?.symbol}
    </button>
  )
})
