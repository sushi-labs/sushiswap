import classNames from 'classnames'
import * as React from 'react'

interface DotsProps {
  children?: React.ReactNode
  className?: string
}

const Dots = React.forwardRef<HTMLSpanElement, DotsProps>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={classNames(
      "after:inline-block after:content-['.'] after:animate-ellipsis after:w-4 after:text-left",
      className
    )}
    {...props}
  >
    {children}
  </span>
))

Dots.displayName = 'Dots'

export { Dots }
