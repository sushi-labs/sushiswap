import { formatSize } from '@nktkas/hyperliquid/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useL2OrderBook } from 'src/lib/perps'
import { StatItem, TableButton } from '../../_common'
import {
  MARKET_SLIPPAGE_DENOMINATOR,
  useUserSettingsState,
} from '../../account-management/settings-provider'
import { useAssetState } from '../asset-state-provider'

export const SlippageStat = () => {
  return (
    <StatItem
      title={
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <span className="underline">Slippage</span>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              Average execution price compared to mid price based on current
              order book.
            </p>
          </HoverCardContent>
        </HoverCard>
      }
      value={<SlippageDialog />}
    />
  )
}

const SlippageDialog = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { marketOrderSlippage },
    mutate: { setMarketOrderSlippage },
  } = useUserSettingsState()
  const {
    state: { activeAsset, asset, tradeSide, size },
  } = useAssetState()
  const { data: orderBook } = useL2OrderBook({
    assetString: activeAsset,
  })
  const [localSlippage, setLocalSlippage] = useState(
    (marketOrderSlippage / MARKET_SLIPPAGE_DENOMINATOR).toFixed(2),
  )
  const estimatedPriceDiff = useMemo(() => {
    if (!orderBook || !size.base || Number(size.base) === 0) return '0'
    const midPrice = asset?.midPrice ?? '1'

    const est = Math.abs(
      (Number(tradeSide === 'long' ? orderBook.bestBid : orderBook.bestAsk) /
        Number(midPrice) -
        1) *
        100,
    )
    if (est < 0) return '0'
    try {
      return formatSize(est, 4)
    } catch {
      return '0'
    }
  }, [orderBook, tradeSide, asset, size])

  const onChange = useCallback((value: string) => {
    setLocalSlippage(value)
  }, [])

  useEffect(() => {
    if (localSlippage?.includes('.')) {
      const [, decimals] = localSlippage.split('.')
      if (decimals.length > 2) {
        onChange(Number(localSlippage).toFixed(2))
      }
    }
  }, [onChange, localSlippage])

  const isValidSlippage = useMemo(() => {
    const slippage = Number(localSlippage)
    return !Number.isNaN(slippage) && slippage >= 0 && slippage <= 100
  }, [localSlippage])

  const onConfirm = useCallback(() => {
    const slippage = Number(localSlippage) * MARKET_SLIPPAGE_DENOMINATOR
    setMarketOrderSlippage(slippage)
    setOpen(false)
  }, [localSlippage, setMarketOrderSlippage])

  const formattedSlippage = useMemo(
    () => (marketOrderSlippage / MARKET_SLIPPAGE_DENOMINATOR).toFixed(2),
    [marketOrderSlippage],
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <TableButton>
          <div className="whitespace-nowrap">
            Est: {estimatedPriceDiff}% / Max: {formattedSlippage}%
          </div>
        </TableButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Adjust Max Slippage</DialogTitle>
          <DialogDescription>
            Max slippage only affects market orders placed from the order form.
            Closing positions will use max slippage of 8% and market TP/SL
            orders will use max slippage of 10%.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 text-sm">
          <div className="flex flex-col gap-4 text-sm">
            <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
              <TextField
                type="number"
                variant="naked"
                onValueChange={onChange}
                value={localSlippage}
                maxDecimals={2}
                placeholder="0.0"
                className={classNames('!text-lg font-medium')}
                unit="%"
              />
            </div>
          </div>

          <Button disabled={!isValidSlippage} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
