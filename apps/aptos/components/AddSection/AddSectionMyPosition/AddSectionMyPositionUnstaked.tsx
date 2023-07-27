import { Typography } from '@sushiswap/ui'
import { FC } from 'react'

export const AddSectionMyPositionUnstaked: FC = () => {
  if ('') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 justify-between items-center">
          <Typography variant="sm" weight={600} className="dark:text-slate-50 text-gray-900">
            My Liquidity Position
          </Typography>
          <div className="h-[16px] w-[40px] animate-pulse bg-slate-600 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 justify-between items-center">
        <Typography variant="sm" weight={600} className="dark:text-slate-50 text-gray-900">
          My Liquidity Position
        </Typography>
        <Typography variant="xs" weight={500} className="dark:text-slate-400 text-gray-600">
          0.01%
        </Typography>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">{}</div>
          <Typography variant="xs" weight={500} className="flex items-center gap-1 dark:text-slate-400 text-gray-600">
            {}
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4">{}</div>
          <Typography variant="xs" weight={500} className="flex items-center gap-1 dark:text-slate-400 text-gray-600">
            {}
          </Typography>
        </div>
      </div>
    </div>
  )
}
