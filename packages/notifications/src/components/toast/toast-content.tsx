'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { TimeAgo } from '@sushiswap/ui'
import { type FC, type ReactNode, useState } from 'react'

interface ToastContent {
  icon?: ReactNode
  summary: ReactNode | ReactNode[]
  description?: ReactNode | ReactNode[]
  code?: boolean
  href?: string | undefined
}

export const ToastContent: FC<ToastContent> = ({
  icon,
  href,
  description,
  summary,
  code = false,
}) => {
  const [date] = useState(new Date())

  return (
    <div className="pt-5 pb-4 px-6 flex gap-4 items-start sm:min-w-[350px]">
      {icon && <div className="mt-0.5">{icon}</div>}
      <div className="flex flex-col gap-1 overflow-hidden">
        {!code ? (
          <>
<<<<<<< HEAD
            <span className="font-semibold mb-1 text-sm text-gray-900 dark:text-slate-200 black:text-accent-foreground">
=======
            <span className="font-medium text-sm text-muted-foreground">
>>>>>>> de54a48669 (Feature/dex 36: toast system (#1874))
              {summary}
            </span>
            <span className="font-medium text-xs text-muted-foreground">
              {description}
            </span>
            {href && (
              <a
                href={href}
                target="_blank"
<<<<<<< HEAD
                className="flex items-center text-sm font-medium gap-2 text-gray-700 dark:text-slate-400 black:text-muted-foreground"
=======
                className="flex items-center text-xs font-medium gap-2 text-muted-foreground"
>>>>>>> de54a48669 (Feature/dex 36: toast system (#1874))
                rel="noreferrer"
              >
                View on explorer{' '}
                <ArrowTopRightOnSquareIcon
                  width={16}
                  height={16}
                  strokeWidth={2}
                />
              </a>
            )}
<<<<<<< HEAD
<<<<<<< HEAD
            <span className="text-[10px] font-medium text-gray-600 dark:text-slate-400 black:text-muted-foreground">
=======
            <span className="text-xs text-[#7B7A87] dark:text-[#ABA5B0]">
>>>>>>> de54a48669 (Feature/dex 36: toast system (#1874))
=======
            <span className="text-xs text-slate-450 dark:text-slate-500">
>>>>>>> 50bdd3703f (Feature/dex 13: bridge selection flow in search bar (#1878))
              <TimeAgo value={date} />
            </span>
          </>
        ) : (
<<<<<<< HEAD
          <div className="scroll bg-gray-100 dark:bg-black/20 p-2 px-3 rounded-lg border border-slate-200/10 text-[10px] text-gray-900 dark:text-slate-200 break-all max-h-[80px] overflow-y-auto black:text-primary">
=======
          <div className="scroll bg-gray-100 dark:bg-black/20 p-2 px-3 rounded-lg border border-slate-200/10 text-[10px] text-muted-foreground break-all max-h-[80px] overflow-y-auto">
>>>>>>> de54a48669 (Feature/dex 36: toast system (#1874))
            <code>{summary}</code>
          </div>
        )}
      </div>
    </div>
  )
}
