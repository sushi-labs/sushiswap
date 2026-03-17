'use client'
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
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  BUILDER_FEE_PERPS,
  type UserPositionsItemType,
  estimateLiquidationPrice,
  formatPrice,
  formatSize,
  getTextColorClass,
  perpsNumberFormatter,
  useExecuteOrders,
  useMidPrice,
  useSymbolSplit,
  useUserAccountValues,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import { CheckboxSetting, StatItem, TableButton } from '../_common'
import { useUserSettingsState } from '../account-management'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

export const ReversePositionDialog = ({
  positionToClose,
  trigger,
  isOpen,
  onOpenChange,
}: {
  positionToClose: UserPositionsItemType
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
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

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )
  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton disabled={isPending || !positionToClose}>
            Reverse
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        variant="perps-default"
      >
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
              <StatItem
                title="Action"
                value={
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                    )}
                  >
                    {positionToClose?.side === 'A'
                      ? 'Close Short & Go Long'
                      : 'Close Long & Go Short'}
                  </p>
                }
              />
              <StatItem
                title="Size"
                value={
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                    )}
                  >
                    {positionSize} {baseSymbol}
                  </p>
                }
              />

              <StatItem title="Price" value={'Market'} />
              <StatItem
                title="Est. Liquidation Price"
                value={
                  <div className="font-medium">
                    {estimatedLiquidationPrice
                      ? perpsNumberFormatter({
                          value: estimatedLiquidationPrice,
                          maxFraxDigits: 2,
                          minFraxDigits: 2,
                        })
                      : 'N/A'}
                  </div>
                }
              />
            </div>
            <CheckboxSetting
              value={quickCloseReversePositionEnabled}
              onChange={setQuickCloseReversePositionEnabled}
              label="Don't show this again"
            />
            {/* connect checker not needed, wont be able to get here unless connected anyway */}
            <PerpsChecker.Legal variant="perps-default">
              <PerpsChecker.EnableTrading variant="perps-default">
                <PerpsChecker.BuilderFee variant="perps-default">
                  <Button
                    variant={
                      positionToClose.side === 'A'
                        ? 'perps-long'
                        : 'perps-short'
                    }
                    onClick={async () => {
                      if (!orderData) return
                      await executeOrdersAsync(
                        { orderData },
                        {
                          onSuccess: () => {
                            handleOpenChange(false)
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
