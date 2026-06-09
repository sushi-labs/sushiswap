'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { TimeAgo, classNames } from '@sushiswap/ui'
import { type FC, type ReactNode, useState } from 'react'
import type { NotificationVariant } from '../../types'

interface ToastContent {
  icon?: ReactNode
  summary: ReactNode | ReactNode[]
  code?: boolean
  href?: string | undefined
  variant?: NotificationVariant
}

const variantsWrapper = {
  default: '',
  perps:
    '!bg-perps-background sm:!min-w-[300px] !border-none !shadow-[inset_1.5px_2px_1px_-2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_1px_-2px_rgba(255,255,255,0.125)]',
}

const variantsTitle = {
  default: '',
  perps: 'text-perps-muted',
}

const variantsHref = {
  default: '',
  perps: 'text-perps-muted',
}

const variantsTime = {
  default: '',
  perps: 'text-perps-muted-50',
}

export const ToastContent: FC<ToastContent> = ({
  icon,
  href,
  summary,
  code = false,
  variant = 'default',
}) => {
  const [date] = useState(new Date())

  return (
    <div
      className={classNames(
        'p-4 flex gap-4 items-start border border-accent',
        variantsWrapper[variant],
      )}
    >
      {icon && <div className="mt-0.5">{icon}</div>}
      <div className="flex flex-col gap-1 overflow-hidden">
        {!code ? (
          <>
            <span
              className={classNames(
                'font-semibold mb-1 text-sm text-gray-900 dark:text-slate-200 black:text-accent-foreground',
                variantsTitle[variant],
              )}
            >
              {summary}
            </span>
            {href && (
              <a
                href={href}
                target="_blank"
                className={classNames(
                  'flex items-center text-sm font-medium gap-2 text-gray-700 dark:text-slate-400 black:text-muted-foreground',
                  variantsHref[variant],
                )}
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
            <span
              className={classNames(
                'text-[10px] font-medium text-gray-600 dark:text-slate-400 black:text-muted-foreground',
                variantsTime[variant],
              )}
            >
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
