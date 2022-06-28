import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Fraction, ZERO } from '@sushiswap/math'
import { classNames, Popover, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import React, { CSSProperties, FC } from 'react'

interface TokenSelectorRow {
  currency: Type
  style?: CSSProperties
  className?: string
  onCurrency(currency: Type): void
  balance?: Record<FundSource, Amount<Type> | undefined>
  price?: Fraction
  fundSource: FundSource
}

export const TokenSelectorRow: FC<TokenSelectorRow> = ({
  currency,
  fundSource,
  style,
  className,
  onCurrency,
  balance,
  price,
}) => {
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

        {balance && balance[fundSource]?.greaterThan(ZERO) && (
          <Popover
            hover
            button={
              <div className="flex flex-col">
                <Typography variant="xs" weight={700} className="text-slate-200 text-right">
                  {balance[fundSource]?.toSignificant(6)}
                </Typography>
                <Typography variant="xxs" className="text-slate-400 text-right">
                  {price ? `$${balance[fundSource]?.multiply(price).toFixed(2)}` : '-'}
                </Typography>
              </div>
            }
            panel={
              <div className="flex gap-5 p-3 bg-slate-700 !rounded-lg">
                <div className="flex flex-col gap-1">
                  <Typography variant="xs" weight={700} className="text-slate-300">
                    Wallet
                  </Typography>
                  <Typography variant="xs" weight={700} className="flex items-center gap-1">
                    <Icon currency={currency} width={14} height={14} />
                    {balance[FundSource.WALLET]?.toSignificant(6)}{' '}
                  </Typography>
                  <Typography variant="xxs" className="text-slate-400">
                    {price ? `$${balance[FundSource.BENTOBOX]?.multiply(price).toFixed(2)}` : '-'}
                  </Typography>
                </div>
                <div className="flex flex-col gap-1">
                  <Typography variant="xs" weight={700} className="text-slate-300">
                    Bentobox
                  </Typography>
                  <Typography variant="xs" weight={700} className="flex items-center gap-1">
                    <Icon currency={currency} width={14} height={14} />
                    {balance[FundSource.BENTOBOX]?.toSignificant(6)}{' '}
                  </Typography>
                  <Typography variant="xxs" className="text-slate-400">
                    {price ? `$${balance[FundSource.BENTOBOX]?.multiply(price).toFixed(2)}` : '-'}
                  </Typography>
                </div>
              </div>
            }
          />
        )}
      </div>
    </button>
  )
}
