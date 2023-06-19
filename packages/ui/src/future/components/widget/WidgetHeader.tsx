import classNames from 'classnames'
import { FC, ReactNode } from 'react'

export interface WidgetHeaderProps {
  title: ReactNode
  children?: ReactNode
  className?: string
}

export const WidgetHeader: FC<WidgetHeaderProps> = ({ title, children, className }) => {
  return (
    <div className={classNames(className, 'p-3 mx-0.5 grid grid-cols-2 items-center pb-4 font-medium')}>
      <p className="font-medium flex items-center gap-2 text-slate-100 hover:text-slate-200">{title}</p>
      <div className="flex justify-end">{children}</div>
    </div>
  )
}
