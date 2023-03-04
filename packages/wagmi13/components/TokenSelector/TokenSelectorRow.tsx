import { AddressZero } from '@ethersproject/constants'
import { Amount, Type } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'
import { classNames } from '@sushiswap/ui13'
import { Icon } from '@sushiswap/ui13/components/currency/Icon'
import React, { CSSProperties, FC, memo, useCallback } from 'react'

export interface TokenSelectorRow {
  id: string
  account?: `0x${string}`
  currency: Type
  style?: CSSProperties
  className?: string
  onSelect(currency: Type): void
  balance?: Amount<Type> | undefined
  price?: Fraction
}

export const TokenSelectorRow: FC<TokenSelectorRow> = memo(function TokenSelectorRow({
  id,
  price,
  balance,
  currency,
  style,
  className,
  onSelect,
}) {
  const onClick = useCallback(() => {
    onSelect(currency)
  }, [currency, onSelect])

  if (balance?.greaterThan(ZERO)) {
    console.log(price)
  }
  return (
    <div
      testdata-id={`${id}-row-${currency.isNative ? AddressZero : currency.wrapped.address.toLowerCase()}`}
      onClick={onClick}
      className={classNames(
        className,
        `group flex items-center w-full hover:bg-black/[0.06] hover:dark:bg-white/[0.06] rounded-lg px-2 h-[48px] token-${currency?.symbol}`
      )}
      style={style}
    >
      <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
        <div className="flex flex-row items-center flex-grow gap-2">
          <div className="w-7 h-7">
            <Icon disableLink currency={currency} width={28} height={28} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 dark:text-slate-200 group-hover:dark:text-slate-50">
              {currency.symbol}
            </span>
            <span className="text-[10px] text-gray-600 dark:text-slate-500 group-hover:dark:text-blue-100">
              {currency.name}
            </span>
          </div>
        </div>

        {balance?.greaterThan(ZERO) && (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-right text-gray-700 dark:text-slate-200">
              {balance?.toSignificant(6)}
            </span>
            <span className="text-[10px] text-right text-gray-500 dark:text-slate-400">
              {price ? `$${balance?.multiply(price).toFixed(2)}` : '-'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})
