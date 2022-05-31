import { Currency, Percent, Price } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { ONE_BIPS } from 'app/constants'
import TradePrice from 'app/features/legacy/swap/TradePrice'
import { classNames } from 'app/functions'
import { Field } from 'app/state/mint/actions'
import React, { FC, useState } from 'react'

interface LiquidityPriceProps {
  currencies: { [field in Field]?: Currency }
  price?: Price<Currency, Currency>
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  className?: string
}

const LiquidityPrice: FC<LiquidityPriceProps> = ({
  currencies,
  price,
  noLiquidity,
  poolTokenPercentage,
  className,
}) => {
  const [inverted, setInverted] = useState(false)

  return (
    <div
      className={classNames(
        'flex flex-col gap-2 px-3 py-2 rounded border border-dark-700 bg-dark-900 shadow-inner',
        className
      )}
    >
      <div className="flex justify-between gap-4">
        <Typography variant="xs">Rate</Typography>
        <div>
          <TradePrice
            inputCurrency={currencies[Field.CURRENCY_A]}
            outputCurrency={currencies[Field.CURRENCY_B]}
            price={price}
            showInverted={inverted}
            setShowInverted={setInverted}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <Typography variant="xs">Share of pool</Typography>
        <Typography variant="xs" className="text-right">
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </Typography>
      </div>
    </div>
  )
}

export default LiquidityPrice
