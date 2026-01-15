import { useBreakpoint } from '@sushiswap/hooks'
import { Button, SkeletonBox, classNames } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import {
  type OrderbookRow,
  useL2OrderBook,
} from 'src/lib/perps/use-l2-order-book'
import {
  getTextColorClass,
  numberFormatter,
  toFixedTrim,
} from 'src/lib/perps/utils'
import { useAssetListState } from '../asset-list-provider'
import { useAssetState } from '../asset-state-provider'

const getTotal = (o: OrderbookRow, side: 'base' | 'quote') => {
  return Number.parseFloat(side === 'base' ? o.totalBase : o.totalQuote)
}

const depthRowStyle = (
  pct: number,
  side: 'bid' | 'ask',
): React.CSSProperties => {
  const clamped = Math.max(0, Math.min(100, pct))

  return side === 'bid'
    ? {
        backgroundImage:
          'linear-gradient(to right, rgba(34,197,94,0.12), rgba(34,197,94,0.12))',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${clamped}% 100%`,
        backgroundPosition: 'left center',
      }
    : {
        backgroundImage:
          'linear-gradient(to left, rgba(239,68,68,0.12), rgba(239,68,68,0.12))',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${clamped}% 100%`,
        backgroundPosition: 'left center',
      }
}

export const OrderBook = ({ className }: { className?: string }) => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const { data, isLoading, error } = useL2OrderBook({
    assetString: activeAsset,
  })
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const { isLg } = useBreakpoint('lg')
  const itemCount = isLg ? 13 : 7

  const [side, setSide] = useState<'base' | 'quote'>('quote')
  const asset = assetList?.get?.(activeAsset)

  const bids = useMemo(() => data?.bids, [data?.bids])
  const asks = useMemo(() => data?.asks, [data?.asks])

  const { baseSymbol, quoteSymbol } = useMemo(() => {
    const symbols =
      asset?.marketType === 'spot'
        ? asset?.symbol?.split('/')
        : asset?.symbol?.split('-')
    return {
      baseSymbol: symbols?.[0] ?? 'BASE',
      quoteSymbol: symbols?.[1] ?? 'QUOTE',
    }
  }, [asset])

  const visibleAsks = useMemo(
    () => asks?.slice(-itemCount) ?? [],
    [asks, itemCount],
  )
  const visibleBids = useMemo(
    () => bids?.slice(0, itemCount) ?? [],
    [bids, itemCount],
  )

  const asksMaxTotal = useMemo(() => {
    let max = 0
    for (const o of visibleAsks) max = Math.max(max, getTotal(o, side))
    return max || 1
  }, [visibleAsks, side])

  const bidsMaxTotal = useMemo(() => {
    let max = 0
    for (const o of visibleBids) max = Math.max(max, getTotal(o, side))
    return max || 1
  }, [visibleBids, side])

  return (
    <div className={classNames('flex flex-col', className ?? '')}>
      <div className="flex justify-end">
        <div className="flex items-center bg-secondary rounded-lg p-0.5">
          <Button
            size="xs"
            variant={side === 'base' ? 'default' : 'ghost'}
            onClick={() => setSide('base')}
            className=" text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md"
          >
            {baseSymbol}
          </Button>
          <Button
            size="xs"
            variant={side === 'quote' ? 'default' : 'ghost'}
            onClick={() => setSide('quote')}
            className=" text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md"
          >
            {quoteSymbol}
          </Button>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-white dark:bg-background text-muted-foreground">
          <tr>
            <th className="text-left font-normal p-0.5 text-xs">Price</th>
            <th className="font-normal p-0.5 text-xs text-right">
              Size{' '}
              {asset ? `(${side === 'base' ? baseSymbol : quoteSymbol})` : ''}
            </th>
            <th className="font-normal p-0.5 text-xs text-right">
              Total{' '}
              {asset ? `(${side === 'base' ? baseSymbol : quoteSymbol})` : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: itemCount * 2 }).map((_, index) => (
              <SkeletonOrderBookRow key={index} />
            ))
          ) : error ? (
            <tr>
              <td
                colSpan={3}
                className="p-2 h-20 text-xs italic text-red-500/70 text-center"
              >
                Error loading trades. {error?.message}
              </td>
            </tr>
          ) : data && data?.bids?.length > 0 && data?.asks?.length > 0 ? (
            <>
              {visibleAsks.map((order, index) => {
                const pct = (getTotal(order, side) / asksMaxTotal) * 100
                return (
                  <tr
                    key={index}
                    className="font-medium relative lg:border-y-[1px] border-y-[.5px] border-transparent transition-[background-size] duration-150"
                    style={depthRowStyle(pct, 'ask')}
                  >
                    <td
                      className={classNames(
                        'px-0.5 py-1 text-xs text-left',
                        getTextColorClass(-1),
                      )}
                    >
                      {numberFormatter.format(Number.parseFloat(order.price))}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right">
                      {numberFormatter.format(
                        Number.parseFloat(
                          side === 'base' ? order.sizeBase : order.sizeQuote,
                        ),
                      )}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right">
                      {numberFormatter.format(
                        Number.parseFloat(
                          side === 'base' ? order.totalBase : order.totalQuote,
                        ),
                      )}
                    </td>
                  </tr>
                )
              })}
              <tr className="border-y-[2px] lg:border-y-[4px] border-transparent">
                <td
                  className="px-0.5 py-0 text-xs dark:bg-slate-800 text-center bg-gray-50 font-medium tabular-nums"
                  colSpan={3}
                >
                  Spread
                  <span className="px-4" />
                  {data?.spreadAbs}
                  <span className="px-4" />
                  {toFixedTrim(Number(data?.spreadPct) * 100, 6)}%
                </td>
              </tr>
              {visibleBids?.map((order, index) => {
                const pct = (getTotal(order, side) / bidsMaxTotal) * 100
                return (
                  <tr
                    key={index}
                    className="font-medium relative lg:border-y-[1px] border-y-[.5px] border-transparent transition-[background-size] duration-150"
                    style={depthRowStyle(pct, 'bid')}
                  >
                    <td
                      className={classNames(
                        'px-0.5 py-1 text-xs text-left',
                        getTextColorClass(1),
                      )}
                    >
                      {numberFormatter.format(Number.parseFloat(order.price))}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right">
                      {numberFormatter.format(
                        Number.parseFloat(
                          side === 'base' ? order.sizeBase : order.sizeQuote,
                        ),
                      )}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right">
                      {numberFormatter.format(
                        Number.parseFloat(
                          side === 'base' ? order.totalBase : order.totalQuote,
                        ),
                      )}
                    </td>
                  </tr>
                )
              })}
            </>
          ) : (
            <tr>
              <td colSpan={3} className="p-2 text-center">
                No trades available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const SkeletonOrderBookRow = () => {
  return (
    <tr>
      <td className="px-0.5 py-1">
        <SkeletonBox className="w-16 h-4" />
      </td>
      <td className="px-0.5 py-1 ">
        <SkeletonBox className="ml-auto w-16 h-4" />
      </td>
      <td className="px-0.5 py-1">
        <SkeletonBox className="w-16 ml-auto h-4" />
      </td>
    </tr>
  )
}
