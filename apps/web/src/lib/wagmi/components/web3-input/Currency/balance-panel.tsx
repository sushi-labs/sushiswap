import { SkeletonText, classNames } from '@sushiswap/ui'
import { type FC, memo, useCallback } from 'react'
import { Amount } from 'sushi'
import { type EvmCurrency, EvmNative } from 'sushi/evm'

import { useIsMounted } from '@sushiswap/hooks'
import type { CurrencyInputProps } from './currency-input'

type BalancePanel = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  id?: string
  account: string | undefined
  balance: Amount<EvmCurrency> | null | undefined
  type: 'INPUT' | 'OUTPUT'
  symbol?: string
}

const MIN_NATIVE_CURRENCY_FOR_GAS = 10n ** 16n // .01 ETH

export const BalancePanel: FC<BalancePanel> = memo(function BalancePanel({
  id,
  balance,
  onChange,
  disableMaxButton,
  loading,
  type,
  symbol,
}) {
  const isMounted = useIsMounted()
  const balanceStr = balance ? `${balance?.toSignificant(6)}` : `0`

  const onClick = useCallback(() => {
    if (onChange && balance?.gt(0n)) {
      if (
        balance.currency.type === 'native' &&
        balance.gt(MIN_NATIVE_CURRENCY_FOR_GAS)
      ) {
        const hundred = new Amount(
          EvmNative.fromChainId(balance.currency.chainId),
          MIN_NATIVE_CURRENCY_FOR_GAS,
        )
        onChange(balance.sub(hundred).toString())
      } else {
        onChange(balance?.gt(0n) ? balance.toString() : '')
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
      Balance: {balanceStr} {symbol || balance?.currency?.symbol}
    </button>
  )
})
