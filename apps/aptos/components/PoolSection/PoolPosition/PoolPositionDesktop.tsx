import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

interface PoolPositionProps {}

export const PoolPositionDesktop: FC<PoolPositionProps> = ({}) => {
  if ('') {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between mb-1 py-0.5">
          <div className="h-[16px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[16px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }
  if (true) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        {
          <div className="flex items-center justify-between mb-1">
            <Typography variant="sm" weight={600} className="dark:text-slate-100 text-gray-900">
              Unstaked Position
            </Typography>
            <Typography variant="xs" weight={500} className="dark:text-slate-100 text-gray-900">
              {}
            </Typography>
          </div>
        }
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
            {}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
              {}
            </Typography>
          </div>
          <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600 text-gray-600">
            {}
          </Typography>
        </div>
      </div>
    )
  }
  return <></>
}
