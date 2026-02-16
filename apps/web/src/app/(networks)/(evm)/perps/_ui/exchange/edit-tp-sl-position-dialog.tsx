import PencilIcon from '@heroicons/react/20/solid/PencilIcon'
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
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useExecuteOrders } from 'src/lib/perps/exchange/use-execute-orders'
import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import { getTextColorClass, numberFormatter } from 'src/lib/perps/utils'
import { CheckboxSetting } from '../_common/checkbox-setting'
import { TableButton } from '../_common/table-button'
import { TpSlInput } from '../_common/tp-sl-input'
import { useAssetListState } from '../asset-list-provider'
import { PerpsChecker } from '../perps-checker'
import { ConfigureAmount } from '../_common/configure-amount';

export const EditTpSlPositionDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [tpPrice, setTpPrice] = useState<string>('')
  const [slPrice, setSlPrice] = useState<string>('')
  const [configureAmount, setConfigureAmount] = useState(false)
  const [size, setSize] = useState<number>(0)

  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  // const { midPrice } = useMidPrice({
  //   assetString: positionToClose.position.coin,
  // })

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

  const positionSize = useMemo(() => {
    if (!positionToClose || !asset) return '0'
    const size = Math.abs(Number(positionToClose.position.szi))
    try {
      return formatSize(size, asset.decimals)
    } catch (error) {
      console.log('error formatting size:', error)
      return '0'
    }
  }, [positionToClose, asset])

  useEffect(() => {
    if(!configureAmount && size === 0 && size !== Number.parseFloat(positionSize)) {
      setSize(Number.parseFloat(positionSize))
    }
  }, [positionSize, configureAmount, size]);

  const entryPrice = useMemo(() => {
    if (!positionToClose || !asset) return '0'

    try {
      return formatPrice(
        positionToClose.position.entryPx,
        asset.decimals,
        asset.marketType,
      )
    } catch (error) {
      console.log('error formatting entry price:', error)
      return '0'
    }
  }, [positionToClose, asset])

  const markPrice = useMemo(() => {
    if (!positionToClose || !asset) return '0'

    try {
      return formatPrice(
        positionToClose.markPrice,
        asset.decimals,
        asset.marketType,
      )
    } catch (error) {
      console.log('error formatting mark price:', error)
      return '0'
    }
  }, [positionToClose, asset])

  const orderData = useMemo(() => {
    return null
    // if (!positionToClose || !asset) return null

    // const position = positionToClose.position

    // const _midPrice = parseUnits(midPrice ?? '0', asset?.decimals)
    // const adjustedPrice =
    //   positionToClose.side === 'A'
    //     ? (_midPrice * BigInt(108)) / BigInt(100) // 8% higher than market price for sell orders
    //     : (_midPrice * BigInt(92)) / BigInt(100) // 8% lower for buy orders

    // //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
    // const marketPrice = formatPrice(
    //   formatUnits(adjustedPrice, asset?.decimals),
    //   asset?.decimals,
    //   asset?.marketType,
    // )

    // const order = {
    //   asset: position.coin,
    //   side:
    //     positionToClose.side === 'A' ? ('short' as const) : ('long' as const),
    //   price: marketPrice,
    //   size: positionSize,
    //   reduceOnly: false,
    //   orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
    // }

    // return {
    //   orders: [order],
    //   builder: {
    //     builderFee: BUILDER_FEE_PERPS,
    //   },
    // }
  }, [])

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
            <PencilIcon className="w-4 h-4" />
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="!text-left">
          <DialogTitle>TP/SL for Position</DialogTitle>
          <DialogDescription>
            Edit your take profit and stop loss orders for this position.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Coin</div>
              <div className="font-medium whitespace-nowrap">
                <p>{baseSymbol}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Size</div>
              <div className="font-medium whitespace-nowrap">
                <p
                  className={classNames(
                    getTextColorClass(positionToClose?.side === 'B' ? 1 : -1),
                  )}
                >
                  {positionSize} {baseSymbol}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Entry Price</div>
              <div className="font-medium">
                {numberFormatter.format(Number.parseFloat(entryPrice))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Mark Price</div>
              <div className="font-medium">
                {numberFormatter.format(Number.parseFloat(markPrice))}
              </div>
            </div>
          </div>
          <TpSlInput
            asset={asset}
            tpPrice={tpPrice}
            onChangeTpPrice={setTpPrice}
            slPrice={slPrice}
            onChangeSlPrice={setSlPrice}
            entryPrice={entryPrice}
            side={positionToClose?.side}
            positionSize={configureAmount ? size.toString() : positionSize}
            positionLeverage={positionToClose?.position.leverage.value}
            showExpectedProfit={true}
          />
          <div>
            <CheckboxSetting
              value={configureAmount}
              onChange={(val) => {
                setConfigureAmount(val)

              }}
              label="Configure amount"
            />
            {
              configureAmount ? 
                <ConfigureAmount 
                  maxDecimals={asset?.decimals ?? 6}
                  coinSymbol={baseSymbol}
                  maxValue={Number.parseFloat(positionSize)}
                  value={size}
                  onChange={setSize}
                  step={ 1 / (10 ** (asset?.decimals ?? 6)) }
                />
              : null
            }
          </div>
          <div>limit price row</div>

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
                  disabled={isPending || !positionToClose}
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
