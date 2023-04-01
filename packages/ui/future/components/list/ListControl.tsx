import classNames from 'classnames'
import { FC, ReactNode } from 'react'

export interface ListControlProps {
  children: ReactNode
  className?: string
}

export const ListControl: FC<ListControlProps> = ({ children, className }) => {
  return (
    <div
      className={classNames('bg-white dark:bg-slate-200 dark:bg-opacity-[0.04] rounded-xl overflow-hidden', className)}
    >
      {children}
    </div>
  )
}
