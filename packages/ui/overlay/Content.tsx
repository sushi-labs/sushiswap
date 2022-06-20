import { forwardRef, ReactNode } from 'react'

import { classNames } from '../index'

export interface Content {
  className?: string
  children: ReactNode | ReactNode[]
}

export const Content = forwardRef<HTMLDivElement, Content>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={classNames(className, 'space-y-3 inline-block w-full p-3 !my-0 h-full')}>
      {children}
    </div>
  )
})
