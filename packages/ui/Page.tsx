import classNames from 'classnames'
import type { FC, HTMLAttributes } from 'react'

export const Page: FC<HTMLAttributes<HTMLElement>> = ({ children, className, ...props }) => (
  <main {...props} className={classNames('w-full max-w-3xl mx-auto py-16', className)}>
    {children}
  </main>
)
