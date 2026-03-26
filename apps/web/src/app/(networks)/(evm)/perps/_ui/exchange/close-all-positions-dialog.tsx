'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useState } from 'react'
import {
  BUILDER_FEE_PERPS,
  formatPrice,
  formatSize,
  useAllMids,
  useExecuteOrders,
  useUserPositions,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import { CheckboxSetting, TableButton } from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

export const CloseAllPositionsDialog = ({
  trigger,
}: { trigger?: ReactNode }) => {
  const { data: userPositions } = useUserPositions()
  const [open, setOpen] = useState(false)
  const [closeType, setCloseType] = useState<'market' | 'limit-at-mid'>(
    'market',
  )
  const { executeOrders, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  const { data: allMidsData } = useAllMids()
  const orderData = useMemo(() => {
    const orders = userPositions.map((pos) => {
      const midPrice = allMidsData?.mids?.[pos.position.coin]
      if (closeType === 'limit-at-mid' && !midPrice) {
        throw new Error(
          `Mid price not available for limit close for ${pos.position.coin}`,
        )
      }
      const asset = assetListData?.get?.(pos.position.coin)
      if (!asset) {
        throw new Error(`Asset data not available for ${pos.position.coin}`)
      }

      const _midPrice = parseUnits(midPrice ?? '0', asset?.formatParseDecimals)
      const adjustedPrice =
        pos.side === 'A'
          ? (_midPrice * BigInt(108)) / BigInt(100) // 8% higher than market price for sell orders
          : (_midPrice * BigInt(92)) / BigInt(100) // 8% lower for buy orders

      //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
      const marketPrice = formatPrice(
        formatUnits(adjustedPrice, asset?.formatParseDecimals),
        asset.decimals,
        asset?.marketType,
      )

      return {
        asset: pos.position.coin,
        side: pos.side === 'A' ? ('long' as const) : ('short' as const),
        price:
          closeType === 'market'
            ? marketPrice
            : formatPrice(midPrice!, asset.decimals, asset?.marketType)!,
        size: formatSize(
          Math.abs(Number.parseFloat(pos.position.szi)),
          asset.decimals,
        ),
        reduceOnly: true,
        orderType:
          closeType === 'market'
            ? { limit: { timeInForce: 'FrontendMarket' as const } }
            : { limit: { timeInForce: 'Gtc' as const } },
      }
    })
    return {
      orders,
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [closeType, userPositions, allMidsData?.mids, assetListData])

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
          <TableButton disabled={isPending || userPositions?.length === 0}>
            Close All
          </TableButton>
        )}
      </DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader>
          <DialogTitle>Close All Positions</DialogTitle>
          <DialogDescription>
            Close all your positions and cancel their associated TP/SL orders.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 text-sm">
          <div className="flex flex-col gap-4 text-sm">
            <CheckboxSetting
              value={closeType === 'market'}
              onChange={(value) => {
                setCloseType(value ? 'market' : 'limit-at-mid')
              }}
              label="Market Close"
            />
            <CheckboxSetting
              value={closeType === 'limit-at-mid'}
              onChange={(value) => {
                setCloseType(value ? 'limit-at-mid' : 'market')
              }}
              label="Limit Close at Mid Price"
            />
          </div>
          <PerpsChecker.Legal size="default" variant="perps-default">
            <PerpsChecker.EnableTrading size="default" variant="perps-default">
              <PerpsChecker.BuilderFee size="default" variant="perps-default">
                <PerpsChecker.Referral size="default" variant="perps-default">
                  <Button
                    size="default"
                    variant="perps-default"
                    onClick={() =>
                      executeOrders(
                        { orderData },
                        {
                          onSuccess: () => {
                            setOpen(false)
                          },
                        },
                      )
                    }
                    loading={isPending}
                  >
                    Confirm{' '}
                    {closeType === 'market'
                      ? 'Market Close'
                      : 'Limit Close at Mid'}
                  </Button>
                </PerpsChecker.Referral>
              </PerpsChecker.BuilderFee>
            </PerpsChecker.EnableTrading>
          </PerpsChecker.Legal>
        </div>
      </DialogContent>
    </Dialog>
  )
}
