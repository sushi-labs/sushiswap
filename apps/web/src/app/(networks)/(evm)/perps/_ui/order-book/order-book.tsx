import { useBreakpoint } from '@sushiswap/hooks'
import { SkeletonBox, classNames } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import {
  type OrderbookRow,
  getTextColorClass,
  perpsNumberFormatter,
  toFixedTrim,
  useL2OrderBook,
  useSymbolSplit,
} from 'src/lib/perps'
import { SideToggle } from '../_common'
import { useUserSettingsState } from '../account-management'
import { useAssetListState } from '../asset-selector'
import { useAssetState } from '../trade-widget'

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
  const {
    data,
    isLoading: isLoadingOrderBook,
    error,
  } = useL2OrderBook({
    assetString: activeAsset,
  })
  const {
    state: {
      assetListQuery: { data: assetList, isLoading: isLoadingAssetList },
    },
  } = useAssetListState()
  const {
    state: { orderBookAnimationDisabled },
  } = useUserSettingsState()
  const isLoading = isLoadingOrderBook || isLoadingAssetList
  const { isLg } = useBreakpoint('lg')
  const itemCount = isLg ? 11 : 7

  const [side, setSide] = useState<'base' | 'quote'>('quote')
  const asset = useMemo(
    () => assetList?.get?.(activeAsset),
    [assetList, activeAsset],
  )

  const bids = useMemo(() => data?.bids, [data?.bids])
  const asks = useMemo(() => data?.asks, [data?.asks])

  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })

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
      <div className="flex justify-end px-2">
        {error ? null : isLoading ? (
          <SkeletonBox className="w-20 h-6 rounded-sm" />
        ) : (
          <SideToggle
            side={side}
            setSide={setSide}
            baseSymbol={baseSymbol}
            quoteSymbol={quoteSymbol}
          />
        )}
      </div>

      <table className="w-full">
        <thead className="bg-[#0D1421] text-muted-foreground">
          {isLoading ? (
            <SkeletonOrderBookRow />
          ) : error ? null : (
            <tr>
              <th className="text-left font-normal pl-2 p-0.5 text-xs">
                Price
              </th>
              <th className="font-normal p-0.5 text-xs text-right">
                Size{' '}
                {asset ? `(${side === 'base' ? baseSymbol : quoteSymbol})` : ''}
              </th>
              <th className="font-normal p-0.5 pr-2 text-xs text-right">
                Total{' '}
                {asset ? `(${side === 'base' ? baseSymbol : quoteSymbol})` : ''}
              </th>
            </tr>
          )}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: itemCount * 2 + (isLg ? 2 : 1) }).map(
              (_, index) => <SkeletonOrderBookRow key={index} />,
            )
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
              {visibleAsks?.map((order, index) => {
                const pct = (getTotal(order, side) / asksMaxTotal) * 100
                return (
                  <tr
                    key={index}
                    className={classNames(
                      'font-medium relative lg:border-y-[1px]  border-y-[.5px] border-transparent',
                      orderBookAnimationDisabled
                        ? ''
                        : 'transition-[background-size] duration-150',
                    )}
                    style={depthRowStyle(pct, 'ask')}
                  >
                    <td
                      className={classNames(
                        'px-0.5 py-1 text-xs text-left pl-2',
                        getTextColorClass(-1),
                      )}
                    >
                      {perpsNumberFormatter({
                        value: order.price,
                        maxFraxDigits: 8,
                      })}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right">
                      {perpsNumberFormatter({
                        value:
                          side === 'base' ? order.sizeBase : order.sizeQuote,
                        maxFraxDigits: 8,
                      })}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right pr-2">
                      {perpsNumberFormatter({
                        value:
                          side === 'base' ? order.totalBase : order.totalQuote,
                        maxFraxDigits: 8,
                      })}
                    </td>
                  </tr>
                )
              })}
              <tr className="border-y-[2px] lg:border-y-[4px] border-transparent">
                <td
                  className="px-0.5 py-0 lg:py-0.5 text-xs dark:bg-slate-800/50 text-center bg-gray-50 font-medium tabular-nums"
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
                    className={classNames(
                      'font-medium relative lg:border-y-[1px] border-y-[.5px] border-transparent',
                      orderBookAnimationDisabled
                        ? ''
                        : 'transition-[background-size] duration-150',
                    )}
                    style={depthRowStyle(pct, 'bid')}
                  >
                    <td
                      className={classNames(
                        'px-0.5 py-1 text-xs text-left pl-2',
                        getTextColorClass(1),
                      )}
                    >
                      {perpsNumberFormatter({
                        value: order.price,
                        maxFraxDigits: 8,
                      })}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right">
                      {perpsNumberFormatter({
                        value:
                          side === 'base' ? order.sizeBase : order.sizeQuote,
                        maxFraxDigits: 8,
                      })}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right pr-2">
                      {perpsNumberFormatter({
                        value:
                          side === 'base' ? order.totalBase : order.totalQuote,
                        maxFraxDigits: 8,
                      })}
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
