import classNames from 'classnames'
import React, { type FC, type ReactNode } from 'react'

export interface ListLabelProps {
  children: ReactNode
  className?: string
}

export const ListLabel: FC<ListLabelProps> = ({ children, className }) => {
  return (
    <span
      className={classNames(
        className,
        'flex justify-start text-xs font-medium text-gray-500 dark:text-slate-400 px-2',
      )}
    >
      {children}
    </span>
  )
}
