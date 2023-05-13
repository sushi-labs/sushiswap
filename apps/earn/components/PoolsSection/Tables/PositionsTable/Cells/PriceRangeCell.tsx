import { classNames } from '@sushiswap/ui'
import { FC, useMemo, useState } from 'react'

import {
  ConcentratedLiquidityPosition,
  useConcentratedLiquidityPool,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'
import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/solid'
import { Position } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { formatTickPrice, getPriceOrderingFromPositionForUI } from '../../../../../lib/functions'
import { Bound } from '../../../../../lib/constants'
import { usePriceInverter } from '../../../../../lib/hooks'
import useIsTickAtLimit from '../../../../../lib/hooks/useIsTickAtLimit'

export const PriceRangeCell: FC<Row<ConcentratedLiquidityPosition>> = ({ row, ctx }) => {
  const [manuallyInverted, setManuallyInverted] = useState(false)
  const { data: token0, isLoading: isToken0Loading } = useTokenWithCache({ chainId: row.chainId, address: row.token0 })
  const { data: token1, isLoading: isToken1Loading } = useTokenWithCache({ chainId: row.chainId, address: row.token1 })
  const { data: pool, isLoading: isPoolLoading } = useConcentratedLiquidityPool({
    chainId: row.chainId,
    token0,
    token1,
    feeAmount: row.fee,
  })

  const position = useMemo(() => {
    if (pool && row.liquidity) {
      return new Position({
        pool,
        liquidity: JSBI.BigInt(row.liquidity),
        tickLower: row.tickLower,
        tickUpper: row.tickUpper,
      })
    }

    return undefined
  }, [pool, row.liquidity, row.tickLower, row.tickUpper])

  const closed = row.liquidity?.eq('0')
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)

  const { priceLower, priceUpper, base } = usePriceInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? token0 : token1
  const currencyBase = inverted ? token1 : token0

  const invalidRange = Boolean(row.tickLower >= row.tickUpper)

  const tickAtLimit = useIsTickAtLimit(row.fee, row.tickLower, row.tickUpper)
  const fullRange = Boolean(tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER])

  const below = pool && true ? pool.tickCurrent < row.tickLower : undefined
  const above = pool && true ? pool.tickCurrent >= row.tickUpper : undefined
  const inRange = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
  const isLoading = isToken0Loading || isToken1Loading || isPoolLoading

  if (isLoading && ctx) return <>{ctx.column.columnDef.meta?.skeleton}</>

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
        Current: {(inverted ? pool?.token1Price : pool?.token0Price)?.toSignificant(6)} {currencyQuote?.symbol} per{' '}
        {currencyBase?.symbol}{' '}
      </span>
    </div>
  )
}
