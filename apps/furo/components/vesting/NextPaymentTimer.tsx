import { useInterval } from '@sushiswap/hooks'
import { Typography } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { FuroStatus, Vesting } from '../../lib'

interface NextPaymentTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface NextPaymentTimerProps {
  vesting?: Vesting
}

export const NextPaymentTimer: FC<NextPaymentTimerProps> = ({ vesting }) => {
  const [remaining, setRemaining] = useState<NextPaymentTimerState>()

  useInterval(() => {
    if (!vesting || !vesting.nextPaymentTimeRemaining) return

    const { days, hours, minutes, seconds } = vesting.nextPaymentTimeRemaining

    setRemaining({
      days: String(Math.max(days, 0)).padStart(2, '0'),
      hours: String(Math.max(hours, 0)).padStart(2, '0'),
      minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
      seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
    })
  }, 1000)

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
          {vesting?.status === FuroStatus.CANCELLED
            ? 'CANCELLED'
            : vesting?.status === FuroStatus.COMPLETED
            ? 'COMPLETED'
            : 'NEXT PAYMENT IN'}
        </Typography>
      </div>
    )
  }

  // No data available
  return <></>
}
