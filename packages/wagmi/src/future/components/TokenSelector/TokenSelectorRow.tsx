import { AddressZero } from '@ethersproject/constants'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { Chain } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'
import { classNames } from '@sushiswap/ui'
import { IconButton } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Icon } from '@sushiswap/ui/components/currency/Icon'
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
  pin?: {
    isPinned: boolean
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
    <div className="relative py-0.5 h-[64px]" style={style}>
      <div
        testdata-id={`${id}-row-${currency.isNative ? AddressZero : currency.wrapped.address.toLowerCase()}`}
        onClick={onClick}
        className={classNames(
          className,
          selected ? 'bg-primary' : '',
          `group flex items-center w-full hover:bg-muted focus:bg-accent h-full rounded-lg px-3 token-${currency?.symbol}`
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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={Chain.from(currency.chainId).getTokenUrl(currency.wrapped.address)}
                className="text-sm text-blue text-gray-500 dark:text-slate-400 hover:text-blue"
              >
                {currency.name}
              </a>
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
              <IconButton
                size="xs"
                icon="⭐"
                variant="ghost"
                name="pin"
                onClick={onPin}
                className={classNames(pin.isPinned ? '' : 'grayscale opacity-50', 'z-50')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
