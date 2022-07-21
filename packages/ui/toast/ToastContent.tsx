import { FC, ReactNode } from 'react'

import { Typography } from '../typography'

interface ToastContent {
  icon: ReactNode
  title: string
  summary: ReactNode | Array<ReactNode>
}

export const ToastContent: FC<ToastContent> = ({ icon, title, summary }) => {
  return (
    <div className="p-4 flex gap-4 items-start">
      <div className="mt-0.5">{icon}</div>
      <div className="flex flex-col gap-1">
        <Typography weight={500} variant="sm" className="text-slate-50">
          {title}
        </Typography>
        <Typography variant="xs" className="text-slate-400">
          {summary}
        </Typography>
      </div>
    </div>
  )
}
