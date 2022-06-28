import { Amount, Type } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'
import { classNames, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import React, { CSSProperties, FC } from 'react'

interface TokenSelectorRow {
  currency: Type
  style?: CSSProperties
  className?: string
  onCurrency(currency: Type): void
  balance?: Amount<Type>
  price?: Fraction
}

export const TokenSelectorRow: FC<TokenSelectorRow> = ({ currency, style, className, onCurrency, balance, price }) => {
  return (
    <button
      type="button"
      onClick={() => onCurrency(currency)}
      className={classNames(
        className,
        `group flex items-center w-full hover:bg-blue-600 px-4 h-[48px] token-${currency?.symbol}`
      )}
      style={style}
    >
      <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
        <div className="flex flex-row items-center flex-grow gap-2">
          <div className="w-7 h-7">
            <Icon currency={currency} width={28} height={28} />
          </div>
          <div className="flex flex-col items-start">
            <Typography variant="xs" weight={700} className="text-slate-200 group-hover:text-slate-50">
              {currency.symbol}
            </Typography>
            <Typography variant="xxs" className="text-slate-500 group-hover:text-blue-100">
              {currency.name}
            </Typography>
          </div>
        </div>
        {balance && balance.greaterThan(ZERO) && (
          <div className="flex flex-col">
            <Typography variant="xs" weight={700} className="flex items-baseline gap-1 text-slate-200 text-right">
              {balance.toSignificant(6)}{' '}
            </Typography>
            <Typography variant="xxs" className="flex flex-col text-slate-400 text-right">
              {price ? `$${balance.multiply(price).toSignificant(6)}` : '-'}
            </Typography>
          </div>
        )}
      </div>
    </button>
  )
}
