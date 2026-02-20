import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { useState } from 'react'
import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import { getTextColorClass } from 'src/lib/perps/utils'
import { CheckboxSetting } from '../../_common/checkbox-setting'
import { StatItem } from '../../_common/stat-item'
import { useUserSettingsState } from '../../account-management/settings-provider'
import { useAssetState } from '../asset-state-provider'
import { LiquidationStat } from '../order-stats/liquidation-stat'
import { ConfirmDialogTrigger } from './confirm-dialog-trigger'
import { PlaceOrderButton } from './place-order-button'

export const ConfirmDialog = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { tradeSide, size, asset, tradeType },
  } = useAssetState()
  const {
    state: { quickConfirmPositionEnabled },
    mutate: { setQuickConfirmPositionEnabled },
  } = useUserSettingsState()
  const { baseSymbol } = useSymbolSplit({
    asset,
  })

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
            <StatItem
              title="Action"
              value={
                <div
                  className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}
                >
                  {tradeSide === 'long' ? 'Long' : 'Short'}
                </div>
              }
            />
            <StatItem
              title="Size"
              value={
                <div
                  className={getTextColorClass(tradeSide === 'long' ? 1 : -1)}
                >
                  {size.base} {baseSymbol}
                </div>
              }
            />
            <StatItem
              title="Price"
              value={
                <div>
                  {tradeType.includes('market') ? 'Market' : 'todo price'}
                </div>
              }
            />
            <LiquidationStat title="Est. Liquidation Price" />
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
