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
    <Card className="bg-gradient-to-r from-blue/20 to-pink/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base tracking-tighter saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
            Zap Mode
          </span>
          <Switch
            testdata-id="toggle-zap-enabled"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
        </CardTitle>
        <CardDescription>
          Deposit with any token of your choice. Let zap mode handle the swap
          and token ratio split.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
