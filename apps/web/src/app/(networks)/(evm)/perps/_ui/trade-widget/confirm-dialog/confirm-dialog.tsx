'use client'
import {
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
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
import { AssetDisplay } from './asset-display'
import { ConfirmDialogTrigger } from './confirm-dialog-trigger'
import { PlaceOrderButton } from './place-order-button'

export const ConfirmDialog = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { tradeType, tradeSide, asset },
  } = useAssetState()
  const {
    state: { quickConfirmPositionEnabled },
    mutate: { setQuickConfirmPositionEnabled },
  } = useUserSettingsState()

  return (
    <PerpsDialog
      open={open}
      onOpenChange={(state) => {
        if (quickConfirmPositionEnabled && !state) return
        setOpen(state)
      }}
    >
      <ConfirmDialogTrigger />
      <PerpsDialogContent>
        <div
          style={{
            background:
              tradeSide === 'short'
                ? 'radial-gradient(50% 45.68% at 50% 0.02%, rgba(251, 113, 133, 0.08) 0%, rgba(251, 113, 133, 0) 100%)'
                : 'radial-gradient(50% 45.68% at 50% 0.02%, rgba(82, 250, 141, 0.08) 0%, rgba(82, 250, 141, 0) 100%)',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-[-8]"
        />
        <PerpsDialogHeader>
          <PerpsDialogTitle>Confirm Order</PerpsDialogTitle>
          <PerpsDialogDescription aria-describedby="confirm dialog" />
        </PerpsDialogHeader>
        <PerpsDialogInnerContent className="!pt-0 ">
          <div className="flex flex-col gap-6">
            <div className="self-center">
              <AssetDisplay />
            </div>
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
          <p className="pt-3 text-xs text-center text-perps-muted-50">
            You pay no gas. The order will be confirmed within a few seconds.
          </p>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
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
