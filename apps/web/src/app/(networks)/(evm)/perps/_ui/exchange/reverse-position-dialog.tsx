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
import { type ReactNode, useMemo, useState } from 'react'
import { BUILDER_FEE_PERPS } from 'src/lib/perps/config'
import { useExecuteOrders } from 'src/lib/perps/exchange'
import { useMidPrice } from 'src/lib/perps/use-mid-price'
import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import { useUserAccountValues } from 'src/lib/perps/use-user-account-values'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import {
  calculateIsolatedMargin,
  enUSFormatNumber,
  estimateLiquidationPrice,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { formatUnits, parseUnits } from 'viem'
import { CheckboxSetting } from '../_common/checkbox-setting'
import { TableButton } from '../_common/table-button'
import { useUserSettingsState } from '../account-management/settings-provider'
import { useAssetListState } from '../asset-selector/asset-list-provider'
import { PerpsChecker } from '../perps-checker'

export const ReversePositionDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const {
    state: { quickCloseReversePositionEnabled },
    mutate: { setQuickCloseReversePositionEnabled },
  } = useUserSettingsState()
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  const { midPrice } = useMidPrice({
    assetString: positionToClose.position.coin,
  })
  const { perpsEquity } = useUserAccountValues()

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
    const size = Math.abs(Number(positionToClose.position.szi)) * 2
    try {
      return formatSize(size, asset.decimals)
    } catch (error) {
      console.log('error formatting size:', error)
      return '0'
    }
  }, [positionToClose, asset])

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
        positionToClose.side === 'B' ? ('short' as const) : ('long' as const),
      price: marketPrice,
      size: positionSize,
      reduceOnly: false,
      orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [positionToClose, midPrice, asset, positionSize])

  const estimatedLiquidationPrice = useMemo(() => {
    if (!positionToClose || !asset || !asset?.markPrice || !perpsEquity) {
      return null
    }
    const positionSize = Math.abs(Number(positionToClose.position.szi))

    const isCross = positionToClose.position.leverage.type === 'cross'
    const maxLeverage = positionToClose.position.maxLeverage * 2
    const quote = positionToClose.position.positionValue
    return estimateLiquidationPrice({
      price: asset?.markPrice,
      side: positionToClose.side === 'A' ? 'B' : 'A',
      accountValue: perpsEquity?.toString(),
      positionSize: positionSize.toString(),
      maintenanceMarginRequired: (Number(quote) / maxLeverage).toString(),
      maintenanceLeverage: maxLeverage.toString(),
      isolatedMargin: positionToClose.position.marginUsed,
      isCross,
    })
  }, [positionToClose, asset, perpsEquity])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (quickCloseReversePositionEnabled && !open) return
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
              if (quickCloseReversePositionEnabled) {
                if (!orderData) return
                await executeOrdersAsync({ orderData })
              }
            }}
          >
            Reverse
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="!text-left">
          <DialogTitle>Reverse Position</DialogTitle>
          <DialogDescription>
            Closes your position at market price and opens a new position in the
            opposite direction.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Action</div>
                <div className="font-medium whitespace-nowrap">
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                    )}
                  >
                    {positionToClose?.side === 'A'
                      ? 'Close Short & Go Long'
                      : 'Close Long & Go Short'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Size</div>
                <div className="font-medium whitespace-nowrap">
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                    )}
                  >
                    {positionSize} {baseSymbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">Market</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  Est. Liquidation Price
                </div>
                <div className="font-medium">
                  {estimatedLiquidationPrice
                    ? enUSFormatNumber.format(
                        Number.parseFloat(estimatedLiquidationPrice),
                      )
                    : 'N/A'}
                </div>
              </div>
            </div>
            <CheckboxSetting
              value={quickCloseReversePositionEnabled}
              onChange={setQuickCloseReversePositionEnabled}
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
                    disabled={isPending || !positionToClose}
                    loading={isPending}
                  >
                    {positionToClose.side === 'A'
                      ? 'Reverse to Long'
                      : 'Reverse to Short'}
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
