import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, Price, Trade, TradeType } from '@sushiswap/core-sdk'
import Input from 'app/components/Input'
import Typography from 'app/components/Typography'
import { useAppDispatch } from 'app/state/hooks'
import { LimitPrice, setLimitOrderInvertState, setLimitPrice } from 'app/state/limit-order/actions'
import useLimitOrderDerivedCurrencies, { useLimitOrderState } from 'app/state/limit-order/hooks'
import React, { FC } from 'react'

interface LimitPriceInputPanel {
  trade?: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  limitPrice?: Price<Currency, Currency>
}

const LimitPriceInputPanel: FC<LimitPriceInputPanel> = ({ trade, limitPrice }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { limitPrice: limitPriceString, invertRate } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const disabled = !inputCurrency || !outputCurrency

  return (
    <div className="flex flex-col gap-1">
      <Typography variant="sm" className="px-2">
        {i18n._(t`Rate`)}
      </Typography>
      <div className="flex justify-between items-baseline bg-dark-900 rounded px-4 py-1.5 border border-dark-700 hover:border-dark-600">
        <Typography weight={700} variant="lg" className="relative flex items-baseline flex-grow gap-3 overflow-hidden">
          <Input.Numeric
            disabled={disabled}
            className="leading-[32px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
            placeholder={trade ? trade.executionPrice.toSignificant(6) : '0.0'}
            id="limit-price-input"
            value={
              (limitPriceString === LimitPrice.CURRENT ? trade?.executionPrice.toSignificant(6) : limitPriceString) ||
              ''
            }
            onUserInput={(value: string) => dispatch(setLimitPrice(value))}
          />
        </Typography>
        <Typography
          variant="sm"
          onClick={() =>
            dispatch(
              setLimitOrderInvertState({
                invertRate: !invertRate,
                limitPrice: limitPrice
                  ? !invertRate
                    ? limitPrice?.invert().toSignificant(6)
                    : limitPrice?.toSignificant(6)
                  : '',
              })
            )
          }
        >
          {invertRate ? inputCurrency?.symbol : outputCurrency?.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default LimitPriceInputPanel
