import { XMarkIcon } from '@heroicons/react/20/solid'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { IconButton } from './iconbutton'

const messageVariants = cva('relative', {
  variants: {
    variant: {
      info: 'bg-blue/10 text-blue dark:text-skyblue dark:bg-skyblue/10',
      destructive: 'bg-red/10 text-red',
      warning: 'bg-yellow/10 dark:text-yellow text-amber-900',
      muted: 'bg-secondary',
      success: 'bg-green/10 text-green',
    },
    size: {
      xs: 'p-6 text-xs rounded-lg',
      sm: 'p-3 text-sm rounded-lg',
      default: 'p-6 rounded-xl',
    },
    hasClose: {
      yes: '',
      no: '',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'default',
  },
})

export interface MessageProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  asChild?: boolean
  children?: React.ReactNode
  onClose?(): void
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ onClose, variant, size, className, children, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp
        {...props}
        ref={ref}
        className={messageVariants({
          variant,
          size,
          className,
          hasClose: onClose ? 'yes' : 'no',
        })}
      >
        {children}
        {onClose ? (
          <div className="absolute right-1 top-1 bottom-0">
            <IconButton
              variant="ghost"
              size="xs"
              name="close"
              icon={XMarkIcon}
              onClick={onClose}
            />
          </div>
        ) : null}
      </Comp>
    )
  },
)

Message.displayName = 'Message'

export { Message }
