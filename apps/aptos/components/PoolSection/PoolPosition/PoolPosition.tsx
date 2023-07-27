import { Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'

interface PoolPositionProps {}

export const PoolPosition: FC<PoolPositionProps> = ({}) => {
  return (
    <div className="flex flex-col dark:bg-slate-800 rounded-2xl bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900/5 dark:border-slate-200/5">
        <Typography weight={600} className="text-gray-900 dark:text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-right dark:text-slate-50 text-gray-900">
            {}
          </Typography>
        </div>
      </div>
      <PoolPositionDesktop />
      <PoolPositionStakedDesktop />
    </div>
  )
}
