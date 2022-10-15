import { Tooltip } from '@sushiswap/ui'
import { FC } from 'react'

export const FarmRewardsAvailableTooltip: FC = () => {
  return (
    <Tooltip
      placement="bottom"
      button={<span>✨</span>}
      panel={<div className="text-xs rounded-2xl text-slate-300">Farm rewards available</div>}
    />
  )
}
