import { AddressZero } from '@ethersproject/constants'
import { Amount, Type } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'
import { Icon } from '@sushiswap/ui/future/components/currency/Icon'
import React, { CSSProperties, FC, memo, useCallback } from 'react'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

export interface TokenSelectorRow {
  id: string
  account?: `0x${string}`
  currency: Type
  style?: CSSProperties
  className?: string
  onSelect(currency: Type): void
  balance?: Amount<Type> | undefined
  price?: Fraction
  pin?: {
    pinned: boolean
    onPin(): void
  }
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
  pin,
  selected,
}) {
  const onClick = useCallback(() => {
    onSelect(currency)
  }, [currency, onSelect])

  const onPin = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    pin?.onPin()
  }, [])

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
                  <div className="bg-white rounded-full dark:bg-slate-800">
                    <CheckCircleIcon width={20} height={20} className="rounded-full text-blue" />
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

          <div className="flex items-center gap-4">
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

            {pin && (
              <div onClick={onPin} onKeyDown={onPin} className="flex items-center justify-center w-8 h-8">
                <div className="w-5 h-5">{pin.pinned ? <StarIconSolid /> : <StarIconOutline />}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
