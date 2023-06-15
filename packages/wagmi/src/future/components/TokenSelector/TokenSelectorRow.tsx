import { AddressZero } from '@ethersproject/constants'
import { Amount, Type } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'
import { Icon } from '@sushiswap/ui/future/components/currency/Icon'
import React, { CSSProperties, FC, memo, useCallback } from 'react'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'

export interface TokenSelectorRow {
  id: string
  account?: `0x${string}`
  currency: Type
  style?: CSSProperties
  className?: string
  onSelect(currency: Type): void
  balance?: Amount<Type> | undefined
  price?: Fraction
  selected: boolean
}

export const TokenSelectorRow: FC<TokenSelectorRow> = memo(function TokenSelectorRow({
  id,
  price,
  balance,
  currency,
  style,
  className,
  onSelect,
  selected,
}) {
  const onClick = useCallback(() => {
    onSelect(currency)
  }, [currency, onSelect])

  return (
    <div className="py-0.5 h-[64px]" style={style}>
      <div
        testdata-id={`${id}-row-${currency.isNative ? AddressZero : currency.wrapped.address.toLowerCase()}`}
        onClick={onClick}
        className={classNames(
          className,
          selected ? 'bg-black/[0.06] dark:bg-white/[0.06]' : '',
          `group flex items-center w-full active:bg-black/[0.06] dark:active:bg-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] h-full rounded-lg px-3 token-${currency?.symbol}`
        )}
      >
        <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
          <div className="flex flex-row items-center flex-grow gap-4">
            {selected ? (
              <Badge
                position="bottom-right"
                badgeContent={
                  <div className="bg-white dark:bg-slate-800 rounded-full">
                    <CheckCircleIcon width={20} height={20} className="text-blue rounded-full" />
                  </div>
                }
              >
                <div className="w-10 h-10">
                  <Icon disableLink currency={currency} width={40} height={40} />
                </div>
              </Badge>
            ) : (
              <div className="w-10 h-10">
                <Icon disableLink currency={currency} width={40} height={40} />
              </div>
            )}
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 dark:group-hover:text-white">
                {currency.symbol}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                {currency.name}
              </span>
            </div>
          </div>

          {balance?.greaterThan(ZERO) && (
            <div className="flex flex-col">
              <span
                className={classNames(
                  selected ? 'font-semibold' : 'font-medium',
                  'text-right text-gray-900 dark:text-slate-50'
                )}
              >
                {balance?.toSignificant(6)}
              </span>
              <span className="text-sm font-medium text-right text-gray-500 dark:text-slate-400">
                {price ? `$${balance?.multiply(price).toFixed(2)}` : '-'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
