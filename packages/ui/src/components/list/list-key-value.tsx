import classNames from 'classnames'
import React, { type FC, type ReactNode } from 'react'

import { SkeletonText } from '../skeleton'

export type ListKeyValueProps =
  | {
      title: ReactNode
      subtitle?: string
      children: ReactNode
      skeleton?: never
      flex?: boolean
      className?: string
      fontWeight?: 'normal' | 'medium'
    }
  | {
      title?: never
      subtitle?: boolean
      children?: never
      skeleton?: boolean
      flex?: boolean
      className?: string
      fontWeight?: 'normal' | 'medium'
    }

export const ListKeyValue: FC<ListKeyValueProps> = ({
  title,
  subtitle,
  children,
  skeleton,
  flex = false,
  className = '',
  fontWeight = 'medium',
}) => {
  if (skeleton) {
    return (
      <div className="grid grid-cols-2 gap-2 px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <SkeletonText fontSize="sm" />
          {subtitle && <SkeletonText fontSize="xs" />}
        </div>
        <div className="flex justify-end">
          <SkeletonText fontSize="sm" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        className,
        flex ? 'flex justify-between items-center' : 'grid grid-cols-2',
        'gap-2 py-3 px-3 rounded-lg',
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className={classNames(
            'text-sm',
            fontWeight === 'medium' ? 'font-medium' : 'font-normal',
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
      <div
        className={classNames(
          'flex justify-end w-full text-sm text-right truncate',
          fontWeight === 'medium' ? 'font-medium' : 'font-normal',
        )}
      >
        {children}
      </div>
    </div>
  )
}
