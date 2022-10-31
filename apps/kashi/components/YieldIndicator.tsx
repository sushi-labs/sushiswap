import { Percent } from '@sushiswap/math'
import { FC } from 'react'

interface YieldIndicatorProps {
  percentage: Percent
}

export const YieldIndicator: FC<YieldIndicatorProps> = ({ percentage }) => {
  return (
    <div className="relative w-full h-2 rounded-full bg-blue/20">
      <div
        className="absolute w-2 h-2 rounded-full bg-blue"
        style={{ left: `${percentage.divide(10)?.toFixed(2)}%` }}
      />
    </div>
  )
}
