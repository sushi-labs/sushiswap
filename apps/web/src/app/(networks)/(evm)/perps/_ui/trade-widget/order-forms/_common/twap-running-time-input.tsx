import { useCallback } from 'react'
import { ValueInput } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const TwapRunningTimeInput = () => {
  const {
    state: { twapRunningTime },
    mutate: { setTwapRunningTime },
  } = useAssetState()

  const handleTwapRunningTimeHoursChange = useCallback(
    (value: string) => {
      const _value = value.replaceAll('.', '')
      setTwapRunningTime({
        ...twapRunningTime,
        hours: _value,
      })
    },
    [setTwapRunningTime, twapRunningTime],
  )
  const handleTwapRunningTimeMinutesChange = useCallback(
    (value: string) => {
      const _value = value.replaceAll('.', '')
      setTwapRunningTime({
        ...twapRunningTime,
        minutes: _value,
      })
    },
    [setTwapRunningTime, twapRunningTime],
  )

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <ValueInput
          value={twapRunningTime.hours}
          onChange={handleTwapRunningTimeHoursChange}
          label="Hour(s)"
          maxDecimals={0}
          className="!py-0 text-sm !px-2"
          placeholder="0"
        />
        <ValueInput
          value={twapRunningTime.minutes}
          onChange={handleTwapRunningTimeMinutesChange}
          label="Minute(s)"
          maxDecimals={0}
          className="!py-0 text-sm !px-2"
          placeholder="0"
        />
      </div>
      <div className="text-xs text-muted-foreground self-end">
        Running Time (5m - 24H)
      </div>
    </div>
  )
}
