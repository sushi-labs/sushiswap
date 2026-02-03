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
  Message,
} from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { BUILDER_FEE_PERPS } from 'src/lib/perps/config'
import { useExecuteOrders } from 'src/lib/perps/exchange/use-execute-orders'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import { useAssetListState } from '../asset-list-provider'

export const CloseAllPositionsDialog = ({
  userPositions,
}: {
  userPositions: UserPositionsItemType[]
}) => {
  const [open, setOpen] = useState(false)
  const [closeType, setCloseType] = useState<'market' | 'limit-at-mid'>(
    'market',
  )
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: {
      allMidsQuery: { data: allMidsData },
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()

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
      const decimals = asset.decimals

      //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
      const marketPrice = formatPrice(
        Number(midPrice) * (pos.side === 'A' ? 1.08 : 0.92),
        decimals,
        asset?.marketType,
      )

      return {
        asset: pos.position.coin,
        side: pos.side === 'B' ? ('long' as const) : ('short' as const),
        price:
          closeType === 'market'
            ? marketPrice
            : formatPrice(midPrice!, decimals, asset?.marketType)!,
        size: formatSize(
          Math.abs(Number.parseFloat(pos.position.szi)),
          decimals,
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
      shouldUseMarketPrices: closeType === 'market',
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
        <button
          disabled={isPending}
          type="button"
          className="font-medium text-blue hover:text-blue/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          Close All
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close All Positions</DialogTitle>
          <DialogDescription>
            Close all your positions and cancel their associated TP/SL orders.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 text-sm">
          <div className="flex flex-col gap-4 text-sm">
            <div
              onClick={() => {
                setCloseType('market')
              }}
              onKeyDown={() => {
                setCloseType('market')
              }}
              className="flex items-center gap-1 whitespace-nowrap text-xs font-medium"
            >
              <Checkbox
                className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
                checked={closeType === 'market'}
                onCheckedChange={(checked) => {
                  setCloseType(checked ? 'market' : 'limit-at-mid')
                }}
              />
              <div>Market Close</div>
            </div>
            <div
              onClick={() => {
                setCloseType('limit-at-mid')
              }}
              onKeyDown={() => {
                setCloseType('limit-at-mid')
              }}
              className="flex items-center gap-1 whitespace-nowrap text-xs font-medium"
            >
              <Checkbox
                className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
                checked={closeType === 'limit-at-mid'}
                onCheckedChange={(checked) => {
                  setCloseType(checked ? 'limit-at-mid' : 'market')
                }}
              />
              <div>Limit Close at Mid Price</div>
            </div>
          </div>

          <Button
            onClick={async () =>
              await executeOrdersAsync(
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
            {closeType === 'market' ? 'Market Close' : 'Limit Close at Mid'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
