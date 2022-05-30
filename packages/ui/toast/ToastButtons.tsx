import { FC } from 'react'

import { Typography } from '../typography'

interface ToastButtons {
  href: string
  onDismiss(): void
}

export const ToastButtons: FC<ToastButtons> = ({ href, onDismiss }) => {
  return (
    <div className="grid grid-cols-2 divide-x divide-slate-700/40">
      <Typography
        as="a"
        href={href}
        target="_blank"
        variant="xs"
        weight={700}
        className="py-3 text-blue text-center hover:bg-slate-700/20 cursor-pointer border-t border-slate-700/40"
      >
        View Detail
      </Typography>
      <Typography
        onClick={onDismiss}
        variant="xs"
        weight={700}
        className="py-3 text-blue text-center hover:bg-slate-700/20 cursor-pointer border-t border-slate-700/40"
      >
        Dismiss
      </Typography>
    </div>
  )
}
