import { useInterval } from '@sushiswap/hooks'
import { FC, ReactElement, useState } from 'react'

import { FuroStatus, Stream, Vesting } from '../lib'

interface FuroTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface FuroTimerProps {
  furo?: Stream | Vesting
  children(params: FuroTimerState & { isCompleted: boolean | undefined }): ReactElement
}

export const FuroTimer: FC<FuroTimerProps> = ({ furo, children }) => {
  const [remaining, setRemaining] = useState<FuroTimerState>({ days: '0', hours: '', minutes: '', seconds: '' })

  useInterval(() => {
    if (!furo || furo.status === FuroStatus.CANCELLED || furo.status === FuroStatus.COMPLETED) return
    const times = [FuroStatus.ACTIVE, FuroStatus.EXTENDED].includes(furo?.status)
      ? furo.remainingTime
      : furo.startingInTime

    if (times) {
      const { days, hours, minutes, seconds } = times
      setRemaining({
        days: String(Math.max(days, 0)).padStart(1, '0'),
        hours: String(Math.max(hours, 0)).padStart(1, '0'),
        minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
        seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
      })
    }
  }, 1000)

  return (
    <>
      {children({
        ...remaining,
        isCompleted: +remaining.days + +remaining.hours + +remaining.minutes + +remaining.seconds === 0,
      })}
    </>
  )
}
