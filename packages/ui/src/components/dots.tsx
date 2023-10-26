import { Slot } from '@radix-ui/react-slot'
import classNames from 'classnames'
import * as React from 'react'

export interface DotsProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  asChild?: boolean
  children?: React.ReactNode
  className?: string
}

const Dots = React.forwardRef<HTMLButtonElement, DotsProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span'

    return (
      <Comp
        ref={ref}
        className={classNames(
          "after:inline-block after:content-['.'] after:animate-ellipsis after:w-4 after:text-left",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

Dots.displayName = 'Dots'

export { Dots }
