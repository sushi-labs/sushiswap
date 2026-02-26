import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { useState } from 'react'
import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import { getTextColorClass, numberFormatter } from 'src/lib/perps/utils'
import { CheckboxSetting } from '../../_common/checkbox-setting'
import { StatItem } from '../../_common/stat-item'
import { useUserSettingsState } from '../../account-management/settings-provider'
import { useAssetState } from '../asset-state-provider'
import { useScaleOrders } from '../hooks/use-scale-orders'
import { LiquidationStat } from '../order-stats/liquidation-stat'
import { ScaleStartEndStat } from '../order-stats/scale-start-end-stat'
import { NumberOfOrdersStat } from '../order-stats/twap-stats/number-of-orders-stat'
import { RuntimeStat } from '../order-stats/twap-stats/runtime-stat'
import { SizePerSuborderStat } from '../order-stats/twap-stats/size-per-suborder-stat'
import { ConfirmDialogTrigger } from './confirm-dialog-trigger'
import { PlaceOrderButton } from './place-order-button'

export const ConfirmDialog = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { tradeType },
  } = useAssetState()
  const {
    state: { quickConfirmPositionEnabled },
    mutate: { setQuickConfirmPositionEnabled },
  } = useUserSettingsState()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (quickConfirmPositionEnabled && !state) return
        setOpen(state)
      }}
    >
      <ConfirmDialogTrigger />
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogDescription>
            You pay no gas. The order will be confirmed within a few seconds.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 ">
          <div className="flex flex-col gap-2">
            {tradeType === 'TWAP' ? (
              <_TwapOrderStats />
            ) : tradeType === 'scale' ? (
              <_ScaleOrderStats />
            ) : (
              <>
                <_RegularOrderStats />
                <LiquidationStat title="Est. Liquidation Price" />
              </>
            )}
          </div>
          <CheckboxSetting
            value={quickConfirmPositionEnabled}
            onChange={setQuickConfirmPositionEnabled}
            label="Dont't show this again"
          />

          <PlaceOrderButton
            onMutate={() => {
              setOpen(false)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

const _RegularOrderStats = () => {
  const {
    state: { tradeSide, size, asset, tradeType, limitPrice },
  } = useAssetState()
  const { baseSymbol } = useSymbolSplit({
    asset,
  })

  return (
    <>
      <StatItem
        title="Action"
        value={
          <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
            {tradeSide === 'long' ? 'Long' : 'Short'}
          </div>
        }
      />
      <StatItem
        title="Size"
        value={
          <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
            {size.base} {baseSymbol}
          </div>
        }
      />
      <StatItem
        title="Price"
        value={
          <div>
            {tradeType.includes('market')
              ? 'Market'
              : numberFormatter.format(Number(limitPrice))}
          </div>
        }
      />
    </>
  )
}

const _ScaleOrderStats = () => {
  const {
    state: { tradeSide, asset },
  } = useAssetState()
  const { baseSymbol } = useSymbolSplit({
    asset,
  })

  const { data } = useScaleOrders()
  const totalSize = data?.totalSize
  const orders = data?.orders

  return (
    <>
      <StatItem
        title="Action"
        value={
          <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
            {tradeSide === 'long' ? 'Buy' : 'Sell'}
          </div>
        }
      />
      <StatItem
        title="Total Size"
        value={
          <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
            {totalSize} {baseSymbol}
          </div>
        }
      />
      <StatItem
        title="Number of Orders"
        value={<div>{orders ? orders?.length : 'N/A'}</div>}
      />
      <ScaleStartEndStat />
    </>
  )
}

const _TwapOrderStats = () => {
  const {
    state: { tradeSide, asset, size },
  } = useAssetState()
  const { baseSymbol } = useSymbolSplit({
    asset,
  })

  return (
    <>
      <StatItem
        title="Action"
        value={
          <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
            {tradeSide === 'long' ? 'Buy' : 'Sell'}
          </div>
        }
      />
      <StatItem
        title="Total Size"
        value={
          <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
            {size.base} {baseSymbol}
          </div>
        }
      />
      <RuntimeStat />
      <StatItem title="Frequency" value={`30 seconds`} />
      <NumberOfOrdersStat />
      <SizePerSuborderStat />
    </>
  )
}
