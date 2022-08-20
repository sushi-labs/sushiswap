import { Percent } from '@sushiswap/math'
import { FC } from 'react'

interface YieldIndicatorProps {
  percentage: Percent
}

export const YieldIndicator: FC<YieldIndicatorProps> = ({ percentage }) => {
  return (
    <div className="relative rounded-full w-full h-2 bg-blue/20">
      <div className="absolute rounded-full w-2 h-2 bg-blue" style={{ left: `${percentage?.toFixed(2)}%` }} />
    </div>
  )
}
