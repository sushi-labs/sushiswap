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
import { useActiveAccountState } from '~evm/perps/active-account-provider'
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
      fillChimeEnabled,
      optOutOfSpotDustCollection,
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
      setFillChimeEnabled,
      setOptOutOfSpotDustCollection,
      setShowPnlCardOnMarketClose,
    },
  } = useUserSettingsState()
  const {
    state: { activeAccount },
  } = useActiveAccountState()
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
              value={fillChimeEnabled}
              onChange={setFillChimeEnabled}
              label="Play Fill Sound"
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
            {activeAccount?.type === 'vault' ? null : (
              <CheckboxSetting
                value={optOutOfSpotDustCollection}
                onChange={setOptOutOfSpotDustCollection}
                label="Opt Out of Spot Dust Collection"
              />
            )}
            {/* todo: sound effects on click? */}
            {activeAccount?.type === 'vault' ? null : (
              <>
                <div className="bg-accent w-full h-[1px]" />
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold">Account Mode</h4>
                  <div className="flex flex-col gap-4">
                    <CheckboxSetting
                      value={!isUnifiedAccountModeEnabled}
                      onChange={setUnifiedAccountModeEnabled}
                      label={
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium text-perps-muted">Manual</p>
                          <div className="!whitespace-normal">
                            Only recommended for automated traders. All DEXs
                            have separate balances and cross margin applies
                            separately within each DEX.
                          </div>
                        </div>
                      }
                    />
                    <CheckboxSetting
                      value={isUnifiedAccountModeEnabled}
                      onChange={(val) => setUnifiedAccountModeEnabled(!val)}
                      label={
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium text-perps-muted">
                            Unified Account (Recommended)
                          </p>
                          <div className="!whitespace-normal">
                            The default account setting where each collateral
                            asset has a separate balance. Perps can only use the
                            settlement asset as collateral, and margining is
                            only shared across cross margin assets with the same
                            collateral asset.
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
