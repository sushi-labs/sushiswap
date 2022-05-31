import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import useInterval from 'app/hooks/useInterval'
import { FC, ReactNode, useState } from 'react'

interface AuctionTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface AuctionTimerProps {
  auction?: Auction
  children?: ((state: AuctionTimerState) => ReactNode) | ReactNode
}

const AuctionTimer: FC<AuctionTimerProps> = ({ auction, children }) => {
  const [remaining, setRemaining] = useState<AuctionTimerState>()

  useInterval(() => {
    if (!auction?.remainingTime) return

    const { days, hours, minutes, seconds } = auction.remainingTime
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
      <div className="flex gap-1 text-high-emphesis">
        <div className="flex items-baseline gap-1">
          <Typography variant="xs" className="text-mono">
            {remaining.days}D
          </Typography>
          <Typography variant="xxs" className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="xs" className="text-mono">
            {remaining.hours}H
          </Typography>
          <Typography variant="xxs" className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="xs" className="text-mono">
            {remaining.minutes}M
          </Typography>
          <Typography variant="xxs" className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="xs" className="text-mono">
            {remaining.seconds}S
          </Typography>
        </div>
      </div>
    )
  }

  // No data available
  return <></>
}

export default AuctionTimer
