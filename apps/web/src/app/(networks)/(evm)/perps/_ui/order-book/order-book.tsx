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
  toFixedTrim,
  useL2OrderBook,
  useSymbolSplit,
} from 'src/lib/perps'
import { useUserSettingsState } from '../account-management'
import { useAssetState } from '../trade-widget'
import { OrderBookRow } from './order-book-row'

export const getTotal = (o: OrderbookRow, orderBookSide: 'base' | 'quote') => {
  return orderBookSide === 'base' ? o.totalBase : o.totalQuote
}

function formatTick(tick: number): string {
  if (tick >= 1)
    return tick.toLocaleString('en-US', { maximumFractionDigits: 0 })
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
    state: { nSigFigs, mantissa, orderBookSide, orderBookAnimationDisabled },
  } = useUserSettingsState()
  const [priceSnapshot, setPriceSnapshot] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const {
    state: { activeAsset, asset },
  } = useAssetState()
  const { data, isLoading, error } = useL2OrderBook({
    assetString: activeAsset,
    nSigFigs: nSigFigs as L2BookParameters['nSigFigs'],
    mantissa,
  })
  const { isLg } = useBreakpoint('lg')
  const itemCount = isLg ? 9 : 7

  // biome-ignore lint/correctness/useExhaustiveDependencies: set snapshot when asset changes
  useEffect(() => {
    setPriceSnapshot(asset?.midPrice || asset?.markPrice || null)
  }, [priceSnapshot, asset?.name])

  const visibleAsks = useMemo(
    () => data?.asks?.slice(-itemCount) ?? [],
    [data?.asks, itemCount],
  )
  const visibleBids = useMemo(
    () => data?.bids?.slice(0, itemCount) ?? [],
    [data?.bids, itemCount],
  )

  const asksMaxTotal = useMemo(
    () => Math.max(1, ...visibleAsks.map((o) => getTotal(o, orderBookSide))),
    [visibleAsks, orderBookSide],
  )
  const bidsMaxTotal = useMemo(
    () => Math.max(1, ...visibleBids.map((o) => getTotal(o, orderBookSide))),
    [visibleBids, orderBookSide],
  )

  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })
  const sideSymbol = orderBookSide === 'base' ? baseSymbol : quoteSymbol

  const rowProps = useMemo(
    () => ({
      orderBookSide,
      animationDisabled: orderBookAnimationDisabled,
    }),
    [orderBookSide, orderBookAnimationDisabled],
  )

  return (
    <div className={classNames('flex flex-col', className ?? '')}>
      <div className="w-full">
        <div className="text-perps-muted-50">
          {isLoading ? (
            <SkeletonOrderBookRow />
          ) : error ? null : (
            <div className="grid grid-cols-3 overflow-hidden">
              <div className="min-w-0 truncate text-left font-normal pl-2 p-0.5 text-xs">
                Price
              </div>
              <div className="min-w-0 truncate font-normal p-0.5 text-right text-xs">
                Size {asset ? `(${sideSymbol})` : ''}
              </div>
              <div className="min-w-0 truncate font-normal p-0.5 pr-2 text-right text-xs">
                Total {asset ? `(${sideSymbol})` : ''}
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
          ) : data && data.bids?.length > 0 && data.asks?.length > 0 ? (
            <>
              {visibleAsks?.map((order) => (
                <OrderBookRow
                  key={`ask-${order.price}`}
                  order={order}
                  side="ask"
                  maxTotal={asksMaxTotal}
                  {...rowProps}
                />
              ))}

              <div className="flex px-2 py-1 lg:py-[4.4px] items-center justify-between border-y-[1px] border-transparent bg-[#EDF0F30D]">
                <SigFigSelector
                  open={open}
                  setOpen={setOpen}
                  priceSnapshot={priceSnapshot}
                />
                <div className="text-xs text-center font-medium tabular-nums flex items-center gap-4">
                  <div>Spread</div>
                  <div>{data?.spreadAbs}</div>
                  <div>{toFixedTrim(Number(data?.spreadPct) * 100, 6)}%</div>
                </div>
              </div>

              {visibleBids?.map((order) => (
                <OrderBookRow
                  key={`bid-${order.price}`}
                  order={order}
                  side="bid"
                  maxTotal={bidsMaxTotal}
                  {...rowProps}
                />
              ))}
            </>
          ) : (
            <div className="grid grid-cols-3">
              <div className="p-2 h-20 text-xs italic text-red-500/70 text-center col-span-3">
                No trades available.
              </div>
            </div>
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

const SkeletonOrderBookRow = () => (
  <div className="grid grid-cols-3">
    <div className="px-0.5 py-1 lg:py-[4.4px]">
      <SkeletonBox className="w-16 h-4" />
    </div>
    <div className="px-0.5 py-1 lg:py-[4.4px]">
      <SkeletonBox className="ml-auto w-16 h-4" />
    </div>
    <div className="px-0.5 py-1 lg:py-[4.4px]">
      <SkeletonBox className="w-16 ml-auto h-4" />
    </div>
  </div>
)
