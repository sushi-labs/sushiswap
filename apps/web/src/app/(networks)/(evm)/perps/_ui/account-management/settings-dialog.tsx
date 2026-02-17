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
import { CheckboxSetting } from '../_common/checkbox-setting'
import { useUserSettingsState } from './settings-provider'

export const SettingsDialog = () => {
  const {
    state: {
      quickCloseMarketPositionEnabled,
      quickCloseReversePositionEnabled,
      orderBookAnimationDisabled,
    },
    mutate: {
      setQuickCloseMarketPositionEnabled,
      setQuickCloseReversePositionEnabled,
      setOrderBookAnimationDisabled,
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
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your custom settings</DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex flex-col gap-4 pb-4">
            <CheckboxSetting
              value={quickCloseMarketPositionEnabled}
              onChange={setQuickCloseMarketPositionEnabled}
              label="One Click Close Market Position"
            />

            <CheckboxSetting
              value={quickCloseReversePositionEnabled}
              onChange={setQuickCloseReversePositionEnabled}
              label="One Click Reverse Position"
            />
            <div className="bg-accent w-full h-[1px]" />
            <CheckboxSetting
              value={orderBookAnimationDisabled}
              onChange={setOrderBookAnimationDisabled}
              label="Disable Order Book Animation"
            />
            {/* todo: show buys/sells on chart */}
            {/* todo: disable unified account mode */}
            {/* todo: hide pnl? */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
