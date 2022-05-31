import { Currency, Price, ZERO } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useUSDCPrice } from 'app/hooks'
import React, { FC, useCallback } from 'react'

interface TradePriceProps {
  price?: Price<Currency, Currency>
  inputCurrency?: Currency
  outputCurrency?: Currency
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  className?: string
}

const TradePrice: FC<TradePriceProps> = ({
  price,
  inputCurrency,
  outputCurrency,
  showInverted,
  setShowInverted,
  className,
}) => {
  // Use currency instead of price?.baseCurrency to preload price
  const inputPrice = useUSDCPrice(inputCurrency)
  const outputPrice = useUSDCPrice(outputCurrency)
  let formattedPrice

  try {
    formattedPrice = showInverted ? price?.toSignificant(4) : price?.invert()?.toSignificant(4)
  } catch (error) {
    formattedPrice = '0'
  }

  const label = showInverted ? `${price?.quoteCurrency?.symbol}` : `${price?.baseCurrency?.symbol} `
  const labelInverted = showInverted ? `${price?.baseCurrency?.symbol} ` : `${price?.quoteCurrency?.symbol}`
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted])
  const fiatPrice = showInverted ? inputPrice : outputPrice

  return (
    <button
      type="button"
      onClick={flipPrice}
      className={classNames('flex w-full gap-1 cursor-pointer hover:text-white select-none', className)}
    >
      <Typography variant="xs" weight={700} className="flex gap-1 tracking-[0.06em] text-white">
        1 {labelInverted} <span className="text-primary">=</span> {formattedPrice} {label}
        {fiatPrice?.greaterThan(ZERO) && (
          <Typography variant="xs" component="span" className="text-secondary">
            (${fiatPrice?.toSignificant(6)})
          </Typography>
        )}
      </Typography>
    </button>
  )
}

export default TradePrice
