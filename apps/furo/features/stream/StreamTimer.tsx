import { FC, ReactNode, useState } from 'react'
import Typography from '../../components/Typography'
import useInterval from '../../hooks/useInterval'
import { Stream } from './context/Stream'

interface StreamTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface StreamTimerProps {
  stream?: Stream
  children?: ((state: StreamTimerState) => ReactNode) | ReactNode
}

const StreamTimer: FC<StreamTimerProps> = ({ stream, children }) => {
  const [remaining, setRemaining] = useState<StreamTimerState>()

  useInterval(() => {
    if (!stream?.remainingTime) return

    const { days, hours, minutes, seconds } = stream.remainingTime
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
      <div className="flex flex-col items-center">
        <div className="grid grid-flow-col grid-cols-4 grid-rows-2 gap-3">
          <div>
            <Typography variant="h3" className="text-mono">
              {remaining.days}
            </Typography>
          </div>
          <div className="row-start-2">
            <Typography variant="lg" className="text-mono">
              days
            </Typography>
          </div>
          <div>
            <Typography variant="h3" className="text-mono">
              {remaining.hours}
            </Typography>
          </div>
          <div className="row-start-2">
            <Typography variant="lg" className="text-mono">
              hours
            </Typography>
          </div>
          <div>
            <Typography variant="h3" className="text-mono">
              {remaining.minutes}
            </Typography>
          </div>
          <div className="row-start-2">
            <Typography variant="lg" className="text-mono">
              min
            </Typography>
          </div>
          <div>
            <Typography variant="h3" className="text-mono">
              {remaining.seconds}
            </Typography>
          </div>
          <div className="row-start-2">
            <Typography variant="lg" className="text-mono">
              sec
            </Typography>
          </div>
        </div>
        Remaining
      </div>
    )
  }

  // No data available
  return <></>
}

export default StreamTimer
