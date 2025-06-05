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
            <span className="font-medium text-sm text-muted-foreground black:text-accent-foreground mb-1">
              {summary}
            </span>
            <span className="font-medium text-xs text-muted-foreground">
              {description}
            </span>
            {href && (
              <a
                href={href}
                target="_blank"
                className="flex items-center text-xs font-medium gap-2 text-muted-foreground black:text-muted-foreground"
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
            <span className="text-xs text-slate-450 dark:text-slate-500 black:text-muted-foreground">
              <TimeAgo value={date} />
            </span>
          </>
        ) : (
          <div className="scroll bg-gray-100 dark:bg-black/20 p-2 px-3 rounded-lg border border-slate-200/10 text-[10px] text-gray-900 dark:text-slate-200 break-all max-h-[80px] overflow-y-auto black:text-primary">
            <code>{summary}</code>
          </div>
        )}
      </div>
    </div>
  )
}
