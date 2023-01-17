import classNames from 'classnames'
import { FC, ReactNode } from 'react'

export interface ListControlProps {
  children: ReactNode
  className?: string
}

export const ListControl: FC<ListControlProps> = ({ children, className }) => {
  return (
    <div className={classNames('p-1 bg-white dark:bg-slate-800 rounded-xl overflow-hidden', className)}>{children}</div>
  )
}
