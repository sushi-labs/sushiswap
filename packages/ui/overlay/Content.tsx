import { forwardRef, ReactNode } from 'react'

import { classNames } from '../index'

export interface Content {
  className?: string
  children: ReactNode | ReactNode[]
}

export const Content = forwardRef<HTMLDivElement, Content>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={classNames(className, 'inline-block w-full pt-12 pb-[68px] !my-0 h-full px-3')}>
      {children}
    </div>
  )
})
