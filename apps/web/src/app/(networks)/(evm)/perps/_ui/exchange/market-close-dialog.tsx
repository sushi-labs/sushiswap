import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
import { useLocalStorage } from '@sushiswap/hooks'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Slider,
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
import { SizeInput } from '../_common/size-input'
import { TableButton } from '../_common/table-button'
import { useAssetListState } from '../asset-list-provider'
import { PerpsChecker } from '../perps-checker'

export const MarketCloseDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const [quickCloseEnabled, setQuickCloseEnabled] = useLocalStorage<boolean>(
    'sushi.perps.market.position.close.dialog',
    false,
  )
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

  //@todo: CLEAN UP
  useEffect(() => {
    if (changeInputRef.current === 'input') return
    if (!positionToClose || !asset || !midPrice) {
      setSizeToClose({ base: '0', quote: '0' })
      return
    }
    const position = positionToClose.position

    const size = parseUnits(
      Math.abs(Number.parseFloat(position.szi)).toString(),
      asset?.decimals,
    )
    const _sizeToClose = (size * BigInt(percentToClose)) / BigInt(100)

    const pricePerUnit = midPrice ?? '0'
    const sizeInQuote = size * parseUnits(pricePerUnit, asset?.decimals)

    const _sizeInQuoteToClose =
      (sizeInQuote * BigInt(percentToClose)) /
      BigInt(100) /
      parseUnits('1', asset?.decimals)

    try {
      const baseSize = formatSize(
        formatUnits(_sizeToClose, asset?.decimals),
        asset?.decimals,
      )
      const quoteSize = formatSize(
        formatUnits(_sizeInQuoteToClose, asset?.decimals),
        asset?.decimals,
      )
      setSizeToClose({
        base: baseSize,
        quote: quoteSize,
      })
    } catch (e) {
      console.error('Error formatting size:', e)
      setSizeToClose({ base: '0', quote: '0' })
    }
  }, [positionToClose, percentToClose, asset, midPrice])

  //@todo: CLEAN UP, crazy slow atm
  const handleSetSizeToClose = useCallback(
    (value: string) => {
      if (!positionToClose || !asset) {
        return
      }
      changeInputRef.current = 'input'
      const position = positionToClose.position
      const currentSize = parseUnits(
        Math.abs(Number.parseFloat(position.szi)).toString(),
        asset?.decimals,
      )
      const pricePerUnit = midPrice ?? '0'
      const sizeInQuote =
        currentSize * parseUnits(pricePerUnit, asset?.decimals)

      // Calculate percent to close based on input size if sizeSide is 'base'
      let newPercentToClose = 0
      if (sizeSide === 'base') {
        const inputSize = parseUnits(value || '0', asset?.decimals)

        newPercentToClose =
          currentSize === BigInt(0)
            ? 0
            : Number((inputSize * BigInt(100)) / currentSize)
      } else {
        const inputSizeInQuote =
          parseUnits(value || '0', asset?.decimals) *
          parseUnits('1', asset?.decimals)
        newPercentToClose =
          currentSize === BigInt(0)
            ? 0
            : Number((inputSizeInQuote * BigInt(100)) / sizeInQuote)
      }

      // Clamp percent to close between 0 and 100
      newPercentToClose = Math.max(0, Math.min(100, newPercentToClose))
      setPercentToClose(newPercentToClose)
      //update sizeToClose state
      const _sizeToClose =
        (currentSize * BigInt(newPercentToClose)) / BigInt(100)
      const _sizeInQuoteToClose =
        (sizeInQuote * BigInt(newPercentToClose)) /
        BigInt(100) /
        parseUnits('1', asset?.decimals)

      try {
        const baseSize = formatSize(
          formatUnits(_sizeToClose, asset?.decimals),
          asset?.decimals,
        )

        const quoteSize = formatSize(
          formatUnits(_sizeInQuoteToClose, asset?.decimals),
          asset?.decimals,
        )

        setSizeToClose({
          base: sizeSide === 'base' ? value : baseSize,
          quote: sizeSide === 'quote' ? value : quoteSize,
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
      onOpenChange={(open) => {
        if (quickCloseEnabled) return
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton
            disabled={isPending || !positionToClose}
            onClick={async () => {
              if (quickCloseEnabled) {
                if (!orderData) return
                await executeOrdersAsync({ orderData })
              }
            }}
          >
            Market
          </TableButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Market Close</DialogTitle>
          <DialogDescription>
            Attempts to close the position immediately.
          </DialogDescription>
        </DialogHeader>
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

          <div className="flex items-center gap-4">
            <Slider
              value={[percentToClose]}
              min={1}
              max={100}
              step={1}
              onValueChange={(val: number[]) => {
                changeInputRef.current = 'slider'
                setPercentToClose(val[0])
              }}
              disabled={isPending || !positionToClose}
              rangeClassName="!bg-blue"
            />
            <div className="border max-w-[58px] min-w-[58px] rounded-md border-accent py-1 px-2 whitespace-nowrap text-sm font-medium text-right">
              {percentToClose.toFixed(0)} %
            </div>
          </div>
          <div
            onClick={() => {
              setQuickCloseEnabled(!quickCloseEnabled)
            }}
            onKeyDown={() => {
              setQuickCloseEnabled(!quickCloseEnabled)
            }}
            className="flex items-center gap-1 whitespace-nowrap text-xs font-medium"
          >
            <Checkbox
              className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
              checked={quickCloseEnabled}
              onCheckedChange={(checked) => {
                setQuickCloseEnabled(!checked)
              }}
            />
            <div>Don&apos;t show this again</div>
          </div>
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
      </DialogContent>
    </Dialog>
  )
}
