import { ZapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
} from '@sushiswap/ui'
import { type FC, useCallback } from 'react'

interface ToggleZapCardProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const ToggleZapCard: FC<ToggleZapCardProps> = ({
  checked,
  onCheckedChange: _onCheckedChange,
}) => {
  const onCheckedChange = useCallback(
    (checked: boolean) => {
      sendAnalyticsEvent(ZapEventName.ZAP_TOGGLE, { checked })
      _onCheckedChange(checked)
    },
    [_onCheckedChange],
  )

  return (
    <Card className="!bg-[#FFFFFF14] dark:!bg-[#FFFFFF14] border-none">
      <CardHeader className="!p-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base tracking-tighter font-semibold flex items-center gap-2 text-blue dark:text-white">
            Zap Mode
          </span>
          <Switch
            testdata-id="toggle-zap-enabled"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
        </CardTitle>
        <CardDescription className="!text-[#535263] !text-base dark:!text-slate-200">
          Deposit with any token of your choice. Let zap mode handle the swap
          and token ratio split.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
