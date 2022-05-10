import { useInterval } from '@sushiswap/hooks'
import { FC, useState } from 'react'
import { Typography } from '@sushiswap/ui'
import { Vesting } from './context'
import { FuroStatus } from './context/enums'
import { Stream } from './context/Stream'

interface FuroTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface FuroTimerProps {
  furo?: Stream | Vesting
}

const FuroTimer: FC<FuroTimerProps> = ({ furo }) => {
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
        <div className="flex justify-center gap-6 text-high-emphesis">
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={700} className="text-high-emphesis text-mono">
              {remaining.days}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              days
            </Typography>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={700} className="text-high-emphesis text-mono">
              {remaining.hours}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              hours
            </Typography>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={700} className="text-high-emphesis text-mono">
              {remaining.minutes}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              min
            </Typography>
          </div>
          <div className="flex flex-col text-center">
            <Typography variant="lg" weight={700} className="text-high-emphesis text-mono">
              {remaining.seconds}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              sec
            </Typography>
          </div>
        </div>
        <Typography variant="xs" weight={400} className="tracking-[0.4em] text-high-emphesis text-center">
          {furo?.isStarted ? `REMAINING` : `STARTS IN`}
        </Typography>
      </div>
    )
  }

  // No data available
  return <></>
}

export default FuroTimer
