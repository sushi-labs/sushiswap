import { AddressZero } from '@ethersproject/constants'
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { Chain } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'
import { classNames, IconButton, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
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
  showWarning: boolean
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
  showWarning,
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
              <div className="flex gap-1">
                <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 dark:group-hover:text-white">
                  {currency.symbol}
                </span>
                {showWarning ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <ExclamationCircleIcon width={20} height={20} className="text-yellow" />
                      </TooltipTrigger>
                      <TooltipContent>Not on our default token list</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-muted-foreground hover:underline">
                      {currency.name ?? currency.symbol}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="flex items-center gap-1">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={Chain.from(currency.chainId).getTokenUrl(currency.wrapped.address)}
                      className="text-blue hover:underline flex gap-1"
                    >
                      Show on explorer <ArrowTopRightOnSquareIcon width={16} height={16} />
                    </a>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
