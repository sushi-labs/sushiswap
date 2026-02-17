import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  classNames,
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
import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import { getTextColorClass } from 'src/lib/perps/utils'
import { formatUnits, parseUnits } from 'viem'
import { CheckboxSetting } from '../_common/checkbox-setting'
import { PercentageSlider } from '../_common/percentage-slider'
import { SizeInput } from '../_common/size-input'
import { TableButton } from '../_common/table-button'
import { useUserSettingsState } from '../account-management/settings-provider'
import { useAssetListState } from '../asset-list-provider'
import { PerpsChecker } from '../perps-checker'

export const MarketCloseDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const {
    state: { quickCloseMarketPositionEnabled },
    mutate: { setQuickCloseMarketPositionEnabled },
  } = useUserSettingsState()
  const [sizeToClose, setSizeToClose] = useState<{
    base: string
    quote: string
  }>({
    base: '0',
    quote: '0',
  })
  const changeInputRef = useRef<'slider' | 'input'>('slider')
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
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

  const { baseSymbol } = useSymbolSplit({ asset })

  //todo: make a math util
  useEffect(() => {
    if (changeInputRef.current === 'input') return

    if (!positionToClose || !asset || midPrice == null) {
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
    if (!positionToClose || !asset) return null

    const position = positionToClose.position

    const _midPrice = parseUnits(midPrice ?? '0', asset?.decimals)
    const adjustedPrice =
      positionToClose.side === 'A'
        ? (_midPrice * BigInt(108)) / BigInt(100) // 8% higher than market price for sell orders
        : (_midPrice * BigInt(92)) / BigInt(100) // 8% lower for buy orders

    //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
    const marketPrice = formatPrice(
      formatUnits(adjustedPrice, asset?.decimals),
      asset?.decimals,
      asset?.marketType,
    )

    const order = {
      asset: position.coin,
      side:
        positionToClose.side === 'B' ? ('long' as const) : ('short' as const),
      price: marketPrice,
      size: sizeToClose.base,
      reduceOnly: true,
      orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [positionToClose, midPrice, asset, sizeToClose])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (quickCloseMarketPositionEnabled && !open) return
        setOpen(state)
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton
            disabled={isPending || !positionToClose}
            onClick={async () => {
              if (quickCloseMarketPositionEnabled) {
                if (!orderData) return
                await executeOrdersAsync({ orderData })
              }
            }}
          >
            Market
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="!text-left">
          <DialogTitle>Market Close</DialogTitle>
          <DialogDescription>
            Attempts to close the position immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Size</div>
                <div className="font-medium whitespace-nowrap">
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                    )}
                  >
                    {sizeToClose.base} {baseSymbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">Market</div>
              </div>
            </div>
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
            <CheckboxSetting
              value={quickCloseMarketPositionEnabled}
              onChange={setQuickCloseMarketPositionEnabled}
              label="Don't show this again"
            />
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
                      isPending ||
                      !positionToClose ||
                      Number.parseFloat(sizeToClose.base) === 0
                    }
                    loading={isPending}
                  >
                    Market Close
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
