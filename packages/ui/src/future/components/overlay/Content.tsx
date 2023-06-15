import classNames from 'classnames'
import { forwardRef, ReactNode } from 'react'

export interface Content {
  className?: string
  children: ReactNode | ReactNode[]
}

export const Content = forwardRef<HTMLDivElement, Content>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={classNames(className, 'inline-block w-full h-full bg-gray-100 p-4 dark:bg-slate-900')}>
      {children}
    </div>
  )
})
