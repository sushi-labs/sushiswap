import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  IconButton,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
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
      isDexAbstractionEnabled,
      showPnlCardOnMarketClose,
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
      setDexAbstractionEnabled,
      setShowPnlCardOnMarketClose,
    },
  } = useUserSettingsState()
  return (
    <PerpsDialog>
      <PerpsDialogTrigger asChild>
        <IconButton
          variant="perps-secondary"
          className="!rounded-xl"
          icon={Cog6ToothIcon}
          name="settings"
          iconProps={{ className: 'w-4 h-4' }}
          aria-label="Open Settings"
        />
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Settings</PerpsDialogTitle>
          <PerpsDialogDescription>
            Manage your custom settings
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
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
              value={showPnlCardOnMarketClose}
              onChange={setShowPnlCardOnMarketClose}
              label="Show Share PnL on Market Close"
            />
            <CheckboxSetting
              value={optOutOfSpotDustCollection}
              onChange={setOptOutOfSpotDustCollection}
              label="Opt Out of Spot Dust Collection"
            />
            {/* todo: sound effects on click? */}
            {/* todo: sound effects on on fill */}
            <div className="bg-accent w-full h-[1px]" />
            <CheckboxSetting
              value={!isDexAbstractionEnabled}
              onChange={setDexAbstractionEnabled}
              label="Disable HIP-3 Dex Abstraction"
            />
            <CheckboxSetting
              value={!isUnifiedAccountModeEnabled}
              onChange={setUnifiedAccountModeEnabled}
              label="Disable Unified Account Mode"
            />
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
