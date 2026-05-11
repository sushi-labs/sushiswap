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

const getTotal = (o: OrderbookRow, orderBookSide: 'base' | 'quote') => {
  return orderBookSide === 'base' ? o.totalBase : o.totalQuote
}

const depthRowStyle = (
  pct: number,
  orderBookSide: 'bid' | 'ask',
): React.CSSProperties => {
  const clamped = Math.max(0, Math.min(100, pct)).toFixed(6)
  return orderBookSide === 'bid'
    ? {
        backgroundImage:
          'linear-gradient(90deg, rgba(82, 250, 141, 0) 0%, rgba(82, 250, 141, 0.07) 50%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${clamped}% 100%`,
        backgroundPosition: 'left center',
        borderRadius: '0 4px 4px 0',
      }
    : {
        backgroundImage:
          'linear-gradient(90deg, rgba(251, 113, 133, 0) 0%, rgba(251, 113, 133, 0.07) 50%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${clamped}% 100%`,
        backgroundPosition: 'left center',
        borderRadius: '0 4px 4px 0',
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
    state: { nSigFigs, mantissa, orderBookSide },
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
  const itemCount = isLg ? 9 : 7

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
    for (const o of visibleAsks) max = Math.max(max, getTotal(o, orderBookSide))
    return max || 1
  }, [visibleAsks, orderBookSide])

  const bidsMaxTotal = useMemo(() => {
    let max = 0
    for (const o of visibleBids) max = Math.max(max, getTotal(o, orderBookSide))
    return max || 1
  }, [visibleBids, orderBookSide])

  return (
    <div className={classNames('flex flex-col', className ?? '')}>
      <div className="w-full">
        <div className="text-muted-foreground">
          {isLoading ? (
            <SkeletonOrderBookRow />
          ) : error ? null : (
            <div className="grid grid-cols-3">
              <div className="text-left font-normal pl-2 p-0.5 text-xs">
                Price
              </div>
              <div className="font-normal p-0.5 text-xs text-right">
                Size{' '}
                {asset
                  ? `(${orderBookSide === 'base' ? baseSymbol : quoteSymbol})`
                  : ''}
              </div>
              <div className="font-normal p-0.5 pr-2 text-xs text-right">
                Total{' '}
                {asset
                  ? `(${orderBookSide === 'base' ? baseSymbol : quoteSymbol})`
                  : ''}
              </div>
            </div>
          )}
        </div>
        <div>
          {isLoading ? (
            Array.from({ length: itemCount * 2 + (isLg ? 2 : 1) }).map(
              (_, index) => <SkeletonOrderBookRow key={index} />,
            )
          ) : error ? (
            <div className="grid grid-cols-3">
              <div className="p-2 h-20 text-xs italic text-red-500/70 text-center col-span-3">
                Error loading trades. {error?.message}
              </div>
            </div>
          ) : data && data?.bids?.length > 0 && data?.asks?.length > 0 ? (
            <>
              {visibleAsks?.map((order, index) => {
                const pct =
                  (getTotal(order, orderBookSide) / asksMaxTotal) * 100
                return (
                  <div
                    key={index}
                    className={classNames(
                      'font-medium relative lg:border-y-[1px] grid grid-cols-3 border-y-[.5px] border-transparent',
                      orderBookAnimationDisabled
                        ? ''
                        : 'transition-[background-size] duration-150',
                    )}
                    style={depthRowStyle(pct, 'ask')}
                  >
                    <div
                      className={classNames(
                        'px-0.5 py-1 lg:py-[4.4px] text-xs text-left pl-2',
                        getTextColorClass(-1),
                      )}
                    >
                      {perpsNumberFormatter({
                        value: order.price,
                        maxFraxDigits: 8,
                      })}
                    </div>
                    <div className="px-0.5 py-1 lg:py-[4.4px] text-xs text-right">
                      {perpsNumberFormatter({
                        value:
                          orderBookSide === 'base'
                            ? order.sizeBase
                            : order.sizeQuote,
                        maxFraxDigits: orderBookSide === 'base' ? 8 : 0,
                      })}
                    </div>
                    <div className="px-0.5 py-1 lg:py-[4.4px] text-xs text-right pr-2">
                      {perpsNumberFormatter({
                        value:
                          orderBookSide === 'base'
                            ? order.totalBase
                            : order.totalQuote,
                        maxFraxDigits: orderBookSide === 'base' ? 8 : 0,
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="flex px-2 py-1 lg:py-[4.4px] items-center justify-between border-y-[1px] border-transparent bg-[#EDF0F30D]">
                <SigFigSelector
                  open={open}
                  setOpen={setOpen}
                  priceSnapshot={priceSnapshot}
                />
                <div className=" text-xs  text-center font-medium tabular-nums flex items-center gap-4">
                  <div>Spread</div>
                  <div>{data?.spreadAbs}</div>
                  <div>{toFixedTrim(Number(data?.spreadPct) * 100, 6)}%</div>
                </div>
              </div>
              {visibleBids?.map((order, index) => {
                const pct =
                  (getTotal(order, orderBookSide) / bidsMaxTotal) * 100
                return (
                  <div
                    key={index}
                    className={classNames(
                      'font-medium grid grid-cols-3 relative lg:border-y-[1px] border-y-[.5px] border-transparent',
                      orderBookAnimationDisabled
                        ? ''
                        : 'transition-[background-size] duration-150',
                    )}
                    style={depthRowStyle(pct, 'bid')}
                  >
                    <div
                      className={classNames(
                        'px-0.5 py-1 lg:py-[4.4px] text-xs text-left pl-2',
                        getTextColorClass(1),
                      )}
                    >
                      {perpsNumberFormatter({
                        value: order.price,
                        maxFraxDigits: 8,
                      })}
                    </div>
                    <div className="px-0.5 py-1 lg:py-[4.4px] text-xs text-right">
                      {perpsNumberFormatter({
                        value:
                          orderBookSide === 'base'
                            ? order.sizeBase
                            : order.sizeQuote,
                        maxFraxDigits: orderBookSide === 'base' ? 8 : 0,
                      })}
                    </div>
                    <div className="px-0.5 py-1 lg:py-[4.4px] text-xs text-right pr-2">
                      {perpsNumberFormatter({
                        value:
                          orderBookSide === 'base'
                            ? order.totalBase
                            : order.totalQuote,
                        maxFraxDigits: orderBookSide === 'base' ? 8 : 0,
                      })}
                    </div>
                  </div>
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
        </div>
      </div>
    </div>
  )
}

const SigFigSelector = ({
  open,
  setOpen,
  priceSnapshot,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  priceSnapshot: string | null
}) => {
  const {
    state: { nSigFigs, mantissa },
    mutate: { setNSigFigs, setMantissa },
  } = useUserSettingsState()
  return (
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
      <DropdownMenuContent className="!rounded-md !bg-black/10">
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
  )
}

const SkeletonOrderBookRow = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="px-0.5 py-1 lg:py-[4.4px]">
        <SkeletonBox className="w-16 h-4" />
      </div>
      <div className="px-0.5 py-1 lg:py-[4.4px] ">
        <SkeletonBox className="ml-auto w-16 h-4" />
      </div>
      <div className="px-0.5 py-1 lg:py-[4.4px]">
        <SkeletonBox className="w-16 ml-auto h-4" />
      </div>
    </div>
  )
}
