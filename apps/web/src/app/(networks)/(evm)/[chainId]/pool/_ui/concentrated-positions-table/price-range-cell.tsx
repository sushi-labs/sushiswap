'use client'

import type { Row } from '@tanstack/react-table'
import { type FC, useMemo, useState } from 'react'
import { Bound } from 'src/lib/constants'
import {
  formatTickPrice,
  getPriceOrderingFromPositionForUI,
} from 'src/lib/functions'
import { usePriceInverter } from 'src/lib/hooks/use-price-inverter'
import { useIsTickAtLimit } from 'src/lib/pool/v3'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { Position } from 'sushi/evm'
import { PositionPriceRangeCell } from '../position-price-range-cell'

export const PriceRangeCell: FC<
  Row<ConcentratedLiquidityPositionWithV3Pool>
> = ({ original }) => {
  const [manuallyInverted, setManuallyInverted] = useState(false)
  const position = useMemo(() => {
    if (original.liquidity) {
      return new Position({
        pool: original.pool,
        liquidity: original.liquidity,
        tickLower: original.tickLower,
        tickUpper: original.tickUpper,
      })
    }

    return undefined
  }, [
    original.liquidity,
    original.pool,
    original.tickLower,
    original.tickUpper,
  ])

  const closed = original.liquidity === 0n
  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)

  const { priceLower, priceUpper, base } = usePriceInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = original.pool.token1
    ? base?.isSame(original.pool.token1)
    : undefined
  const currencyQuote = inverted ? original.pool.token0 : original.pool.token1
  const currencyBase = inverted ? original.pool.token1 : original.pool.token0

  const invalidRange = Boolean(original.tickLower >= original.tickUpper)

  const tickAtLimit = useIsTickAtLimit(
    original.fee,
    original.tickLower,
    original.tickUpper,
  )
  const fullRange = Boolean(
    tickAtLimit[Bound.LOWER] && tickAtLimit[Bound.UPPER],
  )

  const below =
    original.pool && true
      ? original.pool.tickCurrent < original.tickLower
      : undefined
  const above =
    original.pool && true
      ? original.pool.tickCurrent >= original.tickUpper
      : undefined
  const inRange =
    typeof below === 'boolean' && typeof above === 'boolean'
      ? !below && !above
      : false

  return (
    <PositionPriceRangeCell
      lower={
        fullRange
          ? '0'
          : formatTickPrice({
              price: priceLower,
              atLimit: tickAtLimit,
              direction: Bound.LOWER,
            })
      }
      upper={
        fullRange
          ? '∞'
          : formatTickPrice({
              price: priceUpper,
              atLimit: tickAtLimit,
              direction: Bound.UPPER,
            })
      }
      currentPrice={(inverted
        ? original.pool.token1Price
        : original.pool.token0Price
      ).toSignificant(6)}
      quoteSymbol={currencyQuote.symbol}
      baseSymbol={currencyBase.symbol}
      status={
        invalidRange || !inRange
          ? 'out-of-range'
          : closed
            ? 'closed'
            : 'in-range'
      }
      onInvert={() => setManuallyInverted((previous) => !previous)}
    />
  )
}
