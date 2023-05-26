import { classNames } from '@sushiswap/ui'
import { FC, useMemo, useState } from 'react'

import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/solid'
import { Position } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { formatTickPrice, getPriceOrderingFromPositionForUI } from '../../../../../lib/functions'
import { Bound } from '../../../../../lib/constants'
import { usePriceInverter } from '../../../../../lib/hooks'
import useIsTickAtLimit from '../../../../../lib/hooks/useIsTickAtLimit'

export const PriceRangeCell: FC<Row<ConcentratedLiquidityPositionWithV3Pool>> = ({ row }) => {
  const [manuallyInverted, setManuallyInverted] = useState(false)
  const position = useMemo(() => {
    if (row.liquidity) {
      return new Position({
        pool: row.pool,
        liquidity: JSBI.BigInt(row.liquidity),
        tickLower: row.tickLower,
        tickUpper: row.tickUpper,
      })
    }

    return undefined
  }, [row.liquidity, row.pool, row.tickLower, row.tickUpper])

  const closed = row.liquidity?.eq('0')
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)

  const { priceLower, priceUpper, base } = usePriceInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = row.pool.token1 ? base?.equals(row.pool.token1) : undefined
  const currencyQuote = inverted ? row.pool.token0 : row.pool.token1
  const currencyBase = inverted ? row.pool.token1 : row.pool.token0

  const invalidRange = Boolean(row.tickLower >= row.tickUpper)

  const tickAtLimit = useIsTickAtLimit(row.fee, row.tickLower, row.tickUpper)
  const fullRange = Boolean(tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER])

  const below = row.pool && true ? row.pool.tickCurrent < row.tickLower : undefined
  const above = row.pool && true ? row.pool.tickCurrent >= row.tickUpper : undefined
  const inRange = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  return (
    <div
      className="flex flex-col gap-1"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setManuallyInverted((prev) => !prev)
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className={classNames(
            invalidRange || !inRange ? 'bg-red' : closed ? 'bg-slate-700' : 'bg-green',
            'w-2 h-2 rounded-full'
          )}
        />
        <span className="text-sm flex items-center gap-1 text-gray-900 dark:text-slate-50">
          {fullRange ? '0' : formatTickPrice({ price: priceLower, atLimit: tickAtLimit, direction: Bound.UPPER })}{' '}
          {currencyQuote?.symbol}
          <div className="flex items-center">
            <ArrowSmLeftIcon width={16} height={16} className="text-gray-500 dark:text-slate-500" />
            <ArrowSmRightIcon width={16} height={16} className="text-gray-500 dark:text-slate-500 ml-[-7px]" />
          </div>
          {fullRange ? '∞' : formatTickPrice({ price: priceUpper, atLimit: tickAtLimit, direction: Bound.UPPER })}{' '}
          {currencyQuote?.symbol}
        </span>
      </div>
      <span className="text-xs flex items-center gap-1 text-gray-900 dark:text-slate-500">
        Current: {(inverted ? row.pool?.token1Price : row.pool?.token0Price)?.toSignificant(6)} {currencyQuote?.symbol}{' '}
        per {currencyBase?.symbol}{' '}
      </span>
    </div>
  )
}
