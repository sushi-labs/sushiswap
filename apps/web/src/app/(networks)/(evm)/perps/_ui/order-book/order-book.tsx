import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import type { L2BookParameters } from '@nktkas/hyperliquid'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
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
import { useAssetState } from '../trade-widget'

const getTotal = (o: OrderbookRow, side: 'base' | 'quote') => {
  return side === 'base' ? o.totalBase : o.totalQuote
}

const depthRowStyle = (
  pct: number,
  side: 'bid' | 'ask',
): React.CSSProperties => {
  const clamped = Math.max(0, Math.min(100, pct)).toFixed(6)
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

function formatTick(tick: number): string {
  // Avoid floating point ugliness
  if (tick >= 1)
    return tick.toLocaleString('en-US', { maximumFractionDigits: 0 })
  // Count needed decimal places
  const decimals = Math.max(0, -Math.floor(Math.log10(tick)))
  return tick?.toFixed(decimals || 0) || '1'
}

function tickSizeForPreset(
  price: string | null,
  nSigFigs: number,
  mantissa?: number | null,
) {
  if (!price) return '1'
  const sigFigs = nSigFigs > 5 ? 5 : nSigFigs
  const mantissaValue = mantissa || 1
  const magnitude = Math.floor(Math.log10(Number(price)))
  const base = 10 ** (magnitude - (sigFigs - 1))
  return formatTick(base * mantissaValue)
}

export const OrderBook = ({ className }: { className?: string }) => {
  const {
    state: { nSigFigs, mantissa },
    mutate: { setNSigFigs, setMantissa },
  } = useUserSettingsState()
  const [priceSnapshot, setPriceSnapshot] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const {
    state: { activeAsset, asset },
  } = useAssetState()
  const {
    data,
    isLoading: isLoadingOrderBook,
    error,
  } = useL2OrderBook({
    assetString: activeAsset,
    nSigFigs: nSigFigs as L2BookParameters['nSigFigs'],
    mantissa,
  })
  const {
    state: { orderBookAnimationDisabled },
  } = useUserSettingsState()
  const isLoading = isLoadingOrderBook
  const { isLg } = useBreakpoint('lg')
  const itemCount = isLg ? 11 : 7

  const [side, setSide] = useState<'base' | 'quote'>('quote')

  // biome-ignore lint/correctness/useExhaustiveDependencies: set snapshot when asset changes
  useEffect(() => {
    setPriceSnapshot(asset?.midPrice || asset?.markPrice || null)
  }, [priceSnapshot, asset?.name])

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
      <div className="flex justify-between px-2">
        {error ? null : isLoading ? (
          <>
            <SkeletonBox className="w-20 h-6 rounded-sm" />
            <SkeletonBox className="w-20 h-6 rounded-sm" />
          </>
        ) : (
          <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="capitalize flex items-center text-xs">
                {tickSizeForPreset(priceSnapshot, nSigFigs || 5, mantissa) ||
                  'Tick Size'}
                <ChevronDownIcon
                  className={classNames(
                    'w-4 h-4 min-w-4 ml-1 transition-transform',
                    open ? 'rotate-180' : '',
                  )}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="paper !rounded-md !bg-[#18223B]">
                {[5, 7, 6, 4, 3, 2].map((figs) => (
                  <DropdownMenuItem
                    key={figs}
                    className="capitalize"
                    onClick={() => {
                      if (figs === 6 || figs === 7) {
                        setMantissa(figs === 7 ? 2 : 5)
                        setNSigFigs(5)
                        return
                      }

                      setNSigFigs(figs)
                      setMantissa(undefined)
                    }}
                  >
                    {tickSizeForPreset(
                      priceSnapshot,
                      figs,
                      figs > 5 ? (figs === 7 ? 2 : 5) : undefined,
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <SideToggle
              side={side}
              setSide={setSide}
              baseSymbol={baseSymbol}
              quoteSymbol={quoteSymbol}
            />
          </>
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
                        maxFraxDigits: side === 'base' ? 8 : 0,
                      })}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right pr-2">
                      {perpsNumberFormatter({
                        value:
                          side === 'base' ? order.totalBase : order.totalQuote,
                        maxFraxDigits: side === 'base' ? 8 : 0,
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
                        maxFraxDigits: side === 'base' ? 8 : 0,
                      })}
                    </td>
                    <td className="px-0.5 py-1 text-xs text-right pr-2">
                      {perpsNumberFormatter({
                        value:
                          side === 'base' ? order.totalBase : order.totalQuote,
                        maxFraxDigits: side === 'base' ? 8 : 0,
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
