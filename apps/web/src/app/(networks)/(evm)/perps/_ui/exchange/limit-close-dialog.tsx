import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
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
import { type ReactNode, useMemo, useState } from 'react'
import { BUILDER_FEE_PERPS } from 'src/lib/perps/config'
import { useExecuteOrders } from 'src/lib/perps/exchange/use-execute-orders'
import { useMidPrice } from 'src/lib/perps/use-mid-price'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import { currencyFormatter, getTextColorClass } from 'src/lib/perps/utils'
import { TableButton } from '../_common/table-button'
import { useAssetListState } from '../asset-list-provider'
import { PerpsChecker } from '../perps-checker'

//@todo- in progress
export const LimitCloseDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [sizeView, setSizeView] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  // const {midPrice, refreshMidPrice} = useMidPrice({
  //   assetString: positionToClose.position.coin,
  // })
  const {
    state: {
      allMidsQuery: { data: allMidsData },
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()

  const asset = useMemo(() => {
    if (!positionToClose) return null
    const _asset = assetListData?.get?.(positionToClose.position.coin)
    if (!_asset) {
      throw new Error(
        `Asset data not available for ${positionToClose.position.coin}`,
      )
    }
    return _asset
  }, [assetListData, positionToClose])

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

  const sizeToClose = useMemo(() => {
    if (!positionToClose || !asset) return '0'
    const position = positionToClose.position
    const size = Math.abs(Number.parseFloat(position.szi))
    const _sizeToClose = (size * percentToClose * 100) / 10000
    try {
      return formatSize(_sizeToClose, asset?.decimals)
    } catch (e) {
      console.error('Error formatting size:', e)
      return '0'
    }
  }, [positionToClose, percentToClose, asset])

  const sizeToCloseInQuote = useMemo(() => {
    if (!positionToClose || !asset || !sizeToClose) return '0'

    try {
      const pricePerUnit =
        allMidsData?.mids?.[positionToClose.position.coin] ?? 0
      const sizeInQuote = Number(sizeToClose) * Number(pricePerUnit)
      return formatSize(sizeInQuote, asset?.decimals)
    } catch (e) {
      console.error('Error formatting size in quote:', e)
      return '0'
    }
  }, [positionToClose, asset, allMidsData?.mids, sizeToClose])

  const orderData = useMemo(() => {
    if (!positionToClose || !asset) return null
    const position = positionToClose.position
    const midPrice = allMidsData?.mids?.[position.coin]
    if (!midPrice) {
      throw new Error(
        `Mid price not available for market close for ${position.coin}`,
      )
    }

    //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
    const marketPrice = formatPrice(
      Number(midPrice) * (positionToClose.side === 'A' ? 1.08 : 0.92),
      asset?.decimals,
      asset?.marketType,
    )

    const order = {
      asset: position.coin,
      side:
        positionToClose.side === 'B' ? ('long' as const) : ('short' as const),
      price: marketPrice,
      size: sizeToClose,
      reduceOnly: true,
      orderType: { limit: { timeInForce: 'Gtc' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [positionToClose, allMidsData?.mids, asset, sizeToClose])

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Limit Close</DialogTitle>
          <DialogDescription>
            Sends an order to close your position at the limit price
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Size</div>
              <div className="font-medium flex items-center gap-1">
                <div
                  className={classNames(
                    getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                  )}
                >
                  {sizeView === 'base' ? sizeToClose : sizeToCloseInQuote}
                </div>
                <div className="flex items-center border border-accent rounded-lg p-0.5">
                  <Button
                    size="xs"
                    variant={sizeView === 'base' ? 'secondary' : 'ghost'}
                    onClick={() => setSizeView('base')}
                    className={classNames(
                      'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
                      sizeView === 'quote' ? 'text-muted-foreground' : '',
                    )}
                  >
                    {baseSymbol}
                  </Button>
                  <Button
                    size="xs"
                    variant={sizeView === 'quote' ? 'secondary' : 'ghost'}
                    onClick={() => setSizeView('quote')}
                    className={classNames(
                      'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
                      sizeView === 'base' ? 'text-muted-foreground' : '',
                    )}
                  >
                    {quoteSymbol}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Price</div>
              <div className="font-medium">Market</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Slider
              value={[percentToClose]}
              min={1}
              max={100}
              step={1}
              onValueChange={(val: number[]) => {
                setPercentToClose(val[0])
              }}
              disabled={isPending || !positionToClose}
              rangeClassName="!bg-blue"
              thumbClassName="!border-white"
            />
            <div className="border rounded-md border-accent py-1 px-2 whitespace-nowrap text-sm font-medium text-right">
              {percentToClose.toFixed(0)} %
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            <p>Estimaged closed PNL (without fees):</p>
            <p className={classNames('font-medium', getTextColorClass(12))}>
              {currencyFormatter.format(12)}
            </p>
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
                    Number.parseFloat(sizeToClose) === 0
                  }
                  loading={isPending}
                >
                  Confirm
                </Button>
              </PerpsChecker.BuilderFee>
            </PerpsChecker.EnableTrading>
          </PerpsChecker.Legal>
        </div>
      </DialogContent>
    </Dialog>
  )
}
