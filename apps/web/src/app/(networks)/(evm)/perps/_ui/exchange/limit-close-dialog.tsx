import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { BUILDER_FEE_PERPS } from 'src/lib/perps/config'
import { useExecuteOrders } from 'src/lib/perps/exchange/use-execute-orders'
import { useMidPrice } from 'src/lib/perps/use-mid-price'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import { currencyFormatter, getTextColorClass } from 'src/lib/perps/utils'
import { formatUnits, parseUnits } from 'viem'
import { LimitInput } from '../_common/limit-input'
import { PercentageSlider } from '../_common/percentage-slider'
import { SizeInput } from '../_common/size-input'
import { TableButton } from '../_common/table-button'
import { useAssetListState } from '../asset-list-provider'
import { PerpsChecker } from '../perps-checker'

export const LimitCloseDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const [sizeToClose, setSizeToClose] = useState<{
    base: string
    quote: string
  }>({
    base: '0',
    quote: '0',
  })
  const [limitPriceToCloseAt, setLimitPriceToCloseAt] = useState<string>('')
  const changeInputRef = useRef<'slider' | 'input'>('slider')
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
      allMidsQuery: { data: allMidsData },
    },
  } = useAssetListState()

  const currentMidPrice = useMemo(() => {
    if (!positionToClose.position.coin) return null
    return allMidsData?.mids?.[positionToClose.position.coin ?? '']
  }, [allMidsData?.mids, positionToClose.position.coin])
  const { midPrice } = useMidPrice({
    assetString: positionToClose.position.coin,
  })

  const asset = useMemo(() => {
    if (!positionToClose) return undefined
    const _asset = assetListData?.get?.(positionToClose.position.coin)
    if (!_asset) {
      throw new Error(
        `Asset data not available for ${positionToClose.position.coin}`,
      )
    }
    return _asset
  }, [assetListData, positionToClose])

  //todo: make a math util
  useEffect(() => {
    if (changeInputRef.current === 'input') return

    if (!positionToClose || !asset || !midPrice) {
      setSizeToClose({ base: '0', quote: '0' })
      return
    }

    const decimals = asset.decimals
    const SCALE = 10n ** BigInt(decimals)

    const position = positionToClose.position

    const base = parseUnits(
      Math.abs(Number.parseFloat(position.szi)).toString(),
      decimals,
    )

    const percent = BigInt(percentToClose)

    const closeBase = (base * percent) / 100n

    const price = parseUnits(midPrice ?? '0', decimals)

    // quote (scaled) = base * price / SCALE
    const quote = base === 0n ? 0n : (base * price) / SCALE

    const closeQuote = (quote * percent) / 100n

    try {
      const baseSize = formatSize(formatUnits(closeBase, decimals), decimals)
      const quoteSize = formatSize(formatUnits(closeQuote, decimals), decimals)

      setSizeToClose({ base: baseSize, quote: quoteSize })
    } catch (e) {
      console.error('Error formatting size:', e)
      setSizeToClose({ base: '0', quote: '0' })
    }
  }, [positionToClose, percentToClose, asset, midPrice])

  //todo: make a math util
  const handleSetSizeToClose = useCallback(
    (value: string) => {
      if (!positionToClose || !asset) return

      changeInputRef.current = 'input'

      const decimals = asset.decimals
      const SCALE = 10n ** BigInt(decimals)

      const position = positionToClose.position

      // base size (scaled)
      const currentBase = parseUnits(
        Math.abs(Number.parseFloat(position.szi)).toString(),
        decimals,
      )

      // price (scaled) — midPrice is a decimal string like "78876.0"
      const price = parseUnits(midPrice ?? '0', decimals)

      // quote value (scaled) = base * price / SCALE
      const currentQuote =
        currentBase === 0n ? 0n : (currentBase * price) / SCALE

      // input value (scaled) in the currently-selected side
      const inputScaled = parseUnits(value || '0', decimals)

      // percent = input / current * 100
      // (do all math in BigInt, then clamp to [0..100] as number)
      let percentBig = 0n
      if (sizeSide === 'base') {
        percentBig =
          currentBase === 0n ? 0n : (inputScaled * 100n) / currentBase
      } else {
        percentBig =
          currentQuote === 0n ? 0n : (inputScaled * 100n) / currentQuote
      }

      // clamp
      if (percentBig < 0n) percentBig = 0n
      if (percentBig > 100n) percentBig = 100n

      const newPercentToClose = Number(percentBig)
      setPercentToClose(newPercentToClose)

      // derive close sizes from percent (scaled)
      const closeBase = (currentBase * percentBig) / 100n
      const closeQuote = (currentQuote * percentBig) / 100n

      try {
        const baseStr = formatSize(formatUnits(closeBase, decimals), decimals)
        const quoteStr = formatSize(formatUnits(closeQuote, decimals), decimals)

        setSizeToClose({
          base: sizeSide === 'base' ? value : baseStr,
          quote: sizeSide === 'quote' ? value : quoteStr,
        })
      } catch (e) {
        console.error('Error formatting size:', e)
        setSizeToClose({ base: '0', quote: '0' })
      }
    },
    [positionToClose, asset, sizeSide, midPrice],
  )

  const orderData = useMemo(() => {
    if (!positionToClose || !asset || !limitPriceToCloseAt) return null

    const position = positionToClose.position

    const _price = parseUnits(limitPriceToCloseAt ?? '0', asset?.decimals)

    const limitPrice = formatPrice(
      formatUnits(_price, asset?.decimals),
      asset?.decimals,
      asset?.marketType,
    )

    const order = {
      asset: position.coin,
      side:
        positionToClose.side === 'B' ? ('long' as const) : ('short' as const),
      price: limitPrice,
      size: sizeToClose.base,
      reduceOnly: true,
      orderType: { limit: { timeInForce: 'Gtc' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [positionToClose, limitPriceToCloseAt, asset, sizeToClose])

  const estimatedPnL = useMemo(() => {
    if (!positionToClose || !orderData || !limitPriceToCloseAt || !asset) {
      return null
    }

    const orderToClose = orderData.orders?.[0]
    if (!orderToClose) return null

    const decimals = asset.decimals
    const SCALE = 10n ** BigInt(decimals)

    try {
      // scaled prices
      const entryPrice = parseUnits(positionToClose.position.entryPx, decimals)
      const closePrice = parseUnits(limitPriceToCloseAt, decimals)

      // scaled base size
      const size = parseUnits(orderToClose.size, decimals)

      // signed price diff (scaled)
      const priceDiff =
        positionToClose.side === 'B'
          ? closePrice - entryPrice // long
          : entryPrice - closePrice // short

      // pnl (scaled quote) = priceDiff * size / SCALE
      const pnlScaled = (priceDiff * size) / SCALE

      return formatUnits(pnlScaled, decimals)
    } catch {
      return null
    }
  }, [positionToClose, orderData, limitPriceToCloseAt, asset])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state)
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton disabled={isPending || !positionToClose}>
            Limit
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="!text-left">
          <DialogTitle>Limit Close</DialogTitle>
          <DialogDescription>
            Send an order to close you position at the limit price.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <LimitInput
              currentMidPrice={currentMidPrice ?? null}
              value={limitPriceToCloseAt}
              onChange={setLimitPriceToCloseAt}
              maxDecimals={asset?.decimals ?? 6}
            />
            <SizeInput
              asset={asset}
              value={sizeToClose}
              onChange={handleSetSizeToClose}
              sizeSide={sizeSide}
              setSizeSide={setSizeSide}
            />
            <PercentageSlider
              value={percentToClose}
              onChange={(val) => {
                changeInputRef.current = 'slider'
                setPercentToClose(val)
              }}
              disabled={isPending || !positionToClose}
            />
            {estimatedPnL !== null ? (
              <div className="text-xs whitespace-nowrap">
                Estimated closed PNL (without fees):{' '}
                <span className={getTextColorClass(Number(estimatedPnL))}>
                  {currencyFormatter.format(Number.parseFloat(estimatedPnL))}
                </span>
              </div>
            ) : null}
            {/* connect checker not needed, wont be able to get here unless connected anyway */}
            <PerpsChecker.Legal>
              <PerpsChecker.EnableTrading>
                <PerpsChecker.BuilderFee>
                  <Button
                    onClick={async () => {
                      if (!orderData) return
                      await executeOrdersAsync(
                        { orderData },
                        {
                          onSuccess: () => {
                            setOpen(false)
                          },
                        },
                      )
                    }}
                    disabled={
                      isPending || !positionToClose || !limitPriceToCloseAt
                    }
                    loading={isPending}
                  >
                    Limit Close
                  </Button>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
