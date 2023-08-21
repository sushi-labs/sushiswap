import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const messageVariants = cva('', {
  variants: {
    variant: {
      info: 'bg-blue/10 text-blue',
      destructive: 'bg-red/10 text-red',
      warning: 'bg-yellow/10 dark:text-yellow text-amber-900',
      muted: 'bg-secondary',
      success: 'bg-green/10 text-green',
    },
    size: {
      xs: 'p-6 text-xs rounded-lg',
      sm: 'p-6 text-sm rounded-lg',
      default: 'p-6 rounded-xl',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'default',
  },
})

export interface MessageProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof messageVariants> {
  asChild?: boolean
  children?: React.ReactNode
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ variant, size, className, children, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp {...props} ref={ref} className={messageVariants({ variant, size, className })}>
        {children}
      </Comp>
    )
  }
)

Message.displayName = 'Message'

export { Message }
