import { Typography } from '@sushiswap/ui'
import { FC, HTMLAttributes } from 'react'

interface ProgressBarCard extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
}

export const ProgressBarCard: FC<ProgressBarCard> = ({ label, value, children, ...props }) => {
  return (
    <div
      {...props}
      className="flex flex-col gap-2 p-5 shadow-md cursor-pointer bg-slate-800 hover:bg-slate-700 rounded-2xl"
    >
      <div className="flex items-center justify-between gap-2">
        <Typography variant="sm" weight={400}>
          {label}:
        </Typography>
        <Typography variant="lg" weight={500} className="text-slate-200">
          {value}
        </Typography>
      </div>
      {children}
    </div>
  )
}
