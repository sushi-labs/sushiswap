import { ChevronRightIcon } from '@heroicons/react/outline'
import { Currency, Trade, TradeType } from '@sushiswap/core-sdk'
import { unwrappedToken } from 'app/functions/currency/wrappedCurrency'
import React, { Fragment, memo } from 'react'

const SwapRoute = memo(({ trade }: { trade: Trade<Currency, Currency, TradeType> }) => {
  return (
    <div className="flex flex-wrap items-center justify-end">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        const currency = unwrappedToken(token)
        return (
          <Fragment key={i}>
            <div className="flex space-x-2 flex-end">
              <div className="text-sm font-bold text-high-emphesis">{currency.symbol}</div>
            </div>
            {isLastItem ? null : <ChevronRightIcon width={12} height={12} />}
          </Fragment>
        )
      })}
    </div>
  )
})

SwapRoute.displayName = 'SwapRoute'

export default SwapRoute
