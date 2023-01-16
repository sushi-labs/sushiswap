import { useInterval } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { FuroStatus, Stream, Vesting } from '../lib'

interface FuroTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface FuroTimerProps {
  furo?: Stream | Vesting
}

export const FuroTimer: FC<FuroTimerProps> = ({ furo }) => {
  const [remaining, setRemaining] = useState<FuroTimerState>()

  useInterval(() => {
    if (!furo || furo.status === FuroStatus.CANCELLED || furo.status === FuroStatus.COMPLETED) return
    const times = [FuroStatus.ACTIVE, FuroStatus.EXTENDED].includes(furo?.status)
      ? furo.remainingTime
      : furo.startingInTime

    if (times) {
      const { days, hours, minutes, seconds } = times
      setRemaining({
        days: String(Math.max(days, 0)).padStart(2, '0'),
        hours: String(Math.max(hours, 0)).padStart(2, '0'),
        minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
        seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
      })
    }
  }, 1000)

  // Render normally
  if (remaining) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-center gap-6 text-slate-200">
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={500} className="text-slate-200">
              {remaining.days}
            </Typography>
            <Typography variant="sm" className="text-slate-500">
              days
            </Typography>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={500} className="text-slate-200">
              {remaining.hours}
            </Typography>
            <Typography variant="sm" className="text-slate-500">
              hours
            </Typography>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={500} className="text-slate-200">
              {remaining.minutes}
            </Typography>
            <Typography variant="sm" className="text-slate-500">
              min
            </Typography>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={500} className="text-slate-200">
              {remaining.seconds}
            </Typography>
            <Typography variant="sm" className="text-slate-500">
              sec
            </Typography>
          </div>
        </div>
        <Typography variant="xs" weight={400} className="tracking-[0.4em] text-slate-200 text-center">
          {furo?.isStarted ? `REMAINING` : `TILL STREAM STARTS`}
        </Typography>
      </div>
    )
  }

  // No data available
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center gap-6 text-slate-200">
        <div className="flex flex-col text-center">
          <Typography variant="lg" weight={500} className="text-slate-200">
            00
          </Typography>
          <Typography variant="sm" className="text-slate-500">
            days
          </Typography>
        </div>
        <div className="flex flex-col text-center">
          <Typography variant="lg" weight={500} className="text-slate-200">
            00
          </Typography>
          <Typography variant="sm" className="text-slate-500">
            hours
          </Typography>
        </div>
        <div className="flex flex-col text-center">
          <Typography variant="lg" weight={500} className="text-slate-200">
            00
          </Typography>
          <Typography variant="sm" className="text-slate-500">
            min
          </Typography>
        </div>
        <div className="flex flex-col text-center">
          <Typography variant="lg" weight={500} className="text-slate-200">
            00
          </Typography>
          <Typography variant="sm" className="text-slate-500">
            sec
          </Typography>
        </div>
      </div>
      <Typography variant="xs" weight={400} className="tracking-[0.4em] text-slate-200 text-center">
        {furo?.status === FuroStatus.CANCELLED ? `CANCELLED` : 'COMPLETED'}
      </Typography>
    </div>
  )
}
