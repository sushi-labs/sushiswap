'use client'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
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
  const { data: userPositions, isLoading: isUserPositionsLoading } =
    useUserPositions()
  const [open, setOpen] = useState(false)
  const [closeType, setCloseType] = useState<'market' | 'limit-at-mid'>(
    'market',
  )
  const { executeOrders, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData, isLoading: isAssetListLoading },
    },
  } = useAssetListState()
  const { data: allMidsData, isLoading: isAllMidsLoading } = useAllMids()
  const isLoading =
    isUserPositionsLoading || isAssetListLoading || isAllMidsLoading
  const orderData = useMemo(() => {
    if (!assetListData || !allMidsData?.mids || isLoading) return null
    const orders = userPositions
      ?.map((pos) => {
        const midPrice = allMidsData?.mids?.[pos.position.coin]
        if (closeType === 'limit-at-mid' && !midPrice) {
          throw new Error(
            `Mid price not available for limit close for ${pos.position.coin}`,
          )
        }
        const asset = assetListData?.get?.(pos.position.coin)
        if (!asset) {
          console.warn(`Asset data not available for ${pos.position.coin}`)
          return null
        }

        const _midPrice = parseUnits(
          midPrice ?? '0',
          asset?.formatParseDecimals,
        )
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
      .filter((i) => i !== null)
    return {
      orders,
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [closeType, userPositions, allMidsData?.mids, assetListData, isLoading])

  return (
    <PerpsDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton disabled={isPending || userPositions?.length === 0}>
            Close All
          </TableButton>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Close All Positions</PerpsDialogTitle>
          <PerpsDialogDescription>
            Close all your positions and cancel their associated TP/SL orders.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
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
            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <PerpsChecker.EnableTrading
                size="default"
                variant="perps-tertiary"
              >
                <PerpsChecker.BuilderFee
                  size="default"
                  variant="perps-tertiary"
                >
                  <PerpsChecker.HyperReferral
                    size="default"
                    variant="perps-tertiary"
                  >
                    <Button
                      size="default"
                      variant="perps-tertiary"
                      onClick={() => {
                        if (!orderData) return
                        executeOrders(
                          { orderData },
                          {
                            onSuccess: () => {
                              setOpen(false)
                            },
                          },
                        )
                      }}
                      loading={isPending}
                    >
                      Confirm{' '}
                      {closeType === 'market'
                        ? 'Market Close'
                        : 'Limit Close at Mid'}
                    </Button>
                  </PerpsChecker.HyperReferral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
