import { classNames } from '@sushiswap/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type OrderbookRow,
  getTextColorClass,
  perpsNumberFormatter,
} from 'src/lib/perps'
import { useAssetState } from '../trade-widget'
import { getTotal } from './order-book'

const depthRowStyle = (
  pct: number,
  side: 'bid' | 'ask',
): React.CSSProperties => {
  const clamped = Math.max(0, Math.min(100, pct)).toFixed(6)
  const color =
    side === 'bid' ? 'rgba(82, 250, 141, 0.07)' : 'rgba(251, 113, 133, 0.07)'
  return {
    backgroundImage: `linear-gradient(90deg, ${color.replace('0.07', '0')} 0%, ${color} 50%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${clamped}% 100%`,
    backgroundPosition: 'left center',
    borderRadius: '0 4px 4px 0',
  }
}

type OrderBookRowProps = {
  order: OrderbookRow
  side: 'bid' | 'ask'
  orderBookSide: 'base' | 'quote'
  maxTotal: number
  animationDisabled: boolean
}

export const OrderBookRow = ({
  order,
  side,
  orderBookSide,
  maxTotal,
  animationDisabled,
}: OrderBookRowProps) => {
  const {
    state: { tradeType },
    mutate: { setLimitPrice, setTradeType },
  } = useAssetState()
  const pct = useMemo(
    () => (getTotal(order, orderBookSide) / maxTotal) * 100,
    [order, orderBookSide, maxTotal],
  )
  const isBase = orderBookSide === 'base'
  const [flash, setFlash] = useState<boolean>(false)
  const prevOrder = useRef({
    price: order.price,
    sizeBase: order.sizeBase,
    n: order.n,
  })

  useEffect(() => {
    if (animationDisabled) return
    if (
      prevOrder.current.price === order.price &&
      prevOrder.current.sizeBase === order.sizeBase &&
      prevOrder.current.n === order.n
    ) {
      setFlash(true)
    }
    prevOrder.current = {
      price: order.price,
      sizeBase: order.sizeBase,
      n: order.n,
    }

    const id = setTimeout(() => setFlash(false), 300)
    return () => clearTimeout(id)
  }, [animationDisabled, order.price, order.sizeBase, order.n])

  const handleSelectLimitPrice = () => {
    setLimitPrice(order.price)

    if (!tradeType.includes('limit')) {
      setTradeType('limit')
    }
  }

  return (
    <button
      type="button"
      onClick={handleSelectLimitPrice}
      className={classNames(
        'font-medium relative lg:border-y-[1px] grid grid-cols-3 border-y-[.5px] border-transparent w-full cursor-pointer text-left bg-transparent hover:bg-perps-muted/[0.04] focus-visible:outline-none focus-visible:bg-perps-muted/[0.06]',
        animationDisabled ? '' : 'transition-all duration-150',
        flash
          ? side === 'bid'
            ? 'bg-[rgba(82,250,141,0.14)]'
            : 'bg-[rgba(251,113,133,0.14)]'
          : '',
      )}
      style={depthRowStyle(pct, side)}
      aria-label={`Set limit price to ${order.price} USDC`}
    >
      <div
        className={classNames(
          'px-0.5 py-1 lg:py-[4.4px] text-xs text-left pl-2',
          getTextColorClass(side === 'bid' ? 1 : -1),
        )}
      >
        {perpsNumberFormatter({ value: order.price, maxFraxDigits: 8 })}
      </div>
      <div className="px-0.5 py-1 lg:py-[4.4px] text-xs text-right">
        {perpsNumberFormatter({
          value: isBase ? order.sizeBase : order.sizeQuote,
          maxFraxDigits: isBase ? 8 : 0,
        })}
      </div>
      <div className="px-0.5 py-1 lg:py-[4.4px] text-xs text-right pr-2">
        {perpsNumberFormatter({
          value: isBase ? order.totalBase : order.totalQuote,
          maxFraxDigits: isBase ? 8 : 0,
        })}
      </div>
    </button>
  )
}
