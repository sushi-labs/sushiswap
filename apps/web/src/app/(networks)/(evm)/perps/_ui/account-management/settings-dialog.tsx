import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from '@sushiswap/ui'
import { CheckboxSetting } from '../_common'
import { useUserSettingsState } from './settings-provider'

export const SettingsDialog = () => {
  const {
    state: {
      quickCloseMarketPositionEnabled,
      quickCloseReversePositionEnabled,
      orderBookAnimationDisabled,
      quickConfirmPositionEnabled,
      isUnifiedAccountModeEnabled,
      showBuySellInChart,
      disableBgFillNotifs,
      hidePnl,
      optOutOfSpotDustCollection,
    },
    mutate: {
      setQuickCloseMarketPositionEnabled,
      setQuickCloseReversePositionEnabled,
      setOrderBookAnimationDisabled,
      setQuickConfirmPositionEnabled,
      setUnifiedAccountModeEnabled,
      setShowBuySellInChart,
      setDisableBgFillNotifs,
      setHidePnl,
      setOptOutOfSpotDustCollection,
    },
  } = useUserSettingsState()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton
          variant="secondary"
          size="sm"
          icon={Cog6ToothIcon}
          name="settings"
          iconProps={{ className: 'w-4 h-4' }}
          aria-label="Open Settings"
        />
      </DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader className="!text-left">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your custom settings</DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex flex-col gap-4 pb-4">
            <CheckboxSetting
              value={quickConfirmPositionEnabled}
              onChange={setQuickConfirmPositionEnabled}
              label="Skip Order Confirmation"
            />
            <CheckboxSetting
              value={quickCloseMarketPositionEnabled}
              onChange={setQuickCloseMarketPositionEnabled}
              label="Skip Close Market Position Confirmation"
            />
            <CheckboxSetting
              value={quickCloseReversePositionEnabled}
              onChange={setQuickCloseReversePositionEnabled}
              label="Skip Reverse Position Confirmation"
            />
            <div className="bg-accent w-full h-[1px]" />
            <CheckboxSetting
              value={orderBookAnimationDisabled}
              onChange={setOrderBookAnimationDisabled}
              label="Disable Order Book Animation"
            />
            <CheckboxSetting
              value={disableBgFillNotifs}
              onChange={setDisableBgFillNotifs}
              label="Disable Background Fill Notifications"
            />
            <CheckboxSetting
              value={showBuySellInChart}
              onChange={setShowBuySellInChart}
              label="Show Buys/Sells on Chart"
            />
            <CheckboxSetting
              value={hidePnl}
              onChange={setHidePnl}
              label="Hide PnL"
            />
            <CheckboxSetting
              value={optOutOfSpotDustCollection}
              onChange={setOptOutOfSpotDustCollection}
              label="Opt Out of Spot Dust Collection"
            />
            {/* todo: in chart trading */}
            {/* todo: sound effects on click? */}
            {/* todo: sound effects on on fill */}
            <div className="bg-accent w-full h-[1px]" />
            <CheckboxSetting
              value={!isUnifiedAccountModeEnabled}
              onChange={setUnifiedAccountModeEnabled}
              label="Disable Unified Account Mode"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
