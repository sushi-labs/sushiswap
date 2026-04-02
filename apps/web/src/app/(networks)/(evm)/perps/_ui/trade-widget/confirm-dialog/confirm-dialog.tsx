'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { useState } from 'react'
import {
  getTextColorClass,
  perpsNumberFormatter,
  useScaleOrders,
  useSymbolSplit,
} from 'src/lib/perps'
import { CheckboxSetting, StatItem } from '../../_common'
import { useUserSettingsState } from '../../account-management'
import { useAssetState } from '../asset-state-provider'
import {
  LiquidationStat,
  NumberOfOrdersStat,
  RuntimeStat,
  ScaleStartEndStat,
  SizePerSuborderStat,
} from '../order-stats'
import { ConfirmDialogTrigger } from './confirm-dialog-trigger'
import { PlaceOrderButton } from './place-order-button'

export const ConfirmDialog = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { tradeType, asset },
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
      <DialogContent variant="perps-default">
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
                {asset?.marketType === 'perp' ? (
                  <LiquidationStat title="Est. Liquidation Price" />
                ) : null}
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
      {asset?.marketType === 'perp' ? (
        <StatItem
          title="Action"
          value={
            <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
              {tradeSide === 'long' ? 'Long' : 'Short'}
            </div>
          }
        />
      ) : (
        <BuySellStat />
      )}

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
              : perpsNumberFormatter({ value: limitPrice })}
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
      <BuySellStat />
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
      <BuySellStat />
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

const BuySellStat = () => {
  const {
    state: { tradeSide },
  } = useAssetState()
  return (
    <StatItem
      title="Action"
      value={
        <div className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}>
          {tradeSide === 'long' ? 'Buy' : 'Sell'}
        </div>
      }
    />
  )
}
