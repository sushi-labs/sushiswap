import useInterval from 'app/hooks/useInterval'
import { FC, ReactNode, useState } from 'react'
import Typography from 'ui/typography/Typography'
import { Vesting } from '../context'
import { FuroStatus } from '../context/enums'
interface NextPaymentTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface NextPaymentTimerProps {
  vesting?: Vesting
  children?: ((state: NextPaymentTimerState) => ReactNode) | ReactNode
}

const NextPaymentTimer: FC<NextPaymentTimerProps> = ({ vesting, children }) => {
  const [remaining, setRemaining] = useState<NextPaymentTimerState>()

  useInterval(() => {
    if (vesting?.status === FuroStatus.CANCELLED || vesting?.status === FuroStatus.COMPLETED) return
    const { days, hours, minutes, seconds } = vesting.nextPaymentTimeRemaining

    setRemaining({
      days: String(Math.max(days, 0)).padStart(2, '0'),
      hours: String(Math.max(hours, 0)).padStart(2, '0'),
      minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
      seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
    })
  }, 1000)

  // Render props
  if (remaining && typeof children === 'function') return children(remaining)

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
          NEXT PAYMENT IN
        </Typography>
      </div>
    )
  }

  // No data available
  return <></>
}

export default NextPaymentTimer
