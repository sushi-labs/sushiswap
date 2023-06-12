import React, { FC, ReactNode } from 'react'
import { Skeleton } from '../skeleton'
import classNames from 'classnames'

export type ListKeyValueProps =
  | {
      title: ReactNode
      subtitle?: string
      children: ReactNode
      skeleton?: never
      flex?: boolean
      className?: string
    }
  | { title?: never; subtitle?: boolean; children?: never; skeleton?: boolean; flex?: boolean; className?: string }

export const ListKeyValue: FC<ListKeyValueProps> = ({
  title,
  subtitle,
  children,
  skeleton,
  flex = false,
  className = '',
}) => {
  if (skeleton) {
    return (
      <div className="grid grid-cols-2 gap-2 py-3 px-4">
        <div className="flex flex-col gap-0.5">
          <Skeleton.Text fontSize="text-sm" />
          {subtitle && <Skeleton.Text fontSize="text-xs" />}
        </div>
        <div className="flex justify-end">
          <Skeleton.Text fontSize="text-sm" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        className,
        flex ? 'flex justify-between items-center' : 'grid grid-cols-2',
        'gap-2 py-3 px-4'
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</span>
        {subtitle && <span className="text-xs text-gray-500 dark:text-slate-500">{subtitle}</span>}
      </div>
      <div className="flex justify-end">
        <span className="w-full text-right flex justify-end text-sm font-medium text-gray-900 dark:text-slate-50 truncate">
          {children}
        </span>
      </div>
    </div>
  )
}
