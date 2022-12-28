import classNames from 'classnames'
import React, { FC } from 'react'

export interface ListLabelProps {
  children: string
  className?: string
}

export const ListLabel: FC<ListLabelProps> = ({ children, className }) => {
  return (
    <span className={classNames(className, 'flex justify-start text-xs font-medium text-gray-500 dark:text-slate-500')}>
      {children}
    </span>
  )
}
