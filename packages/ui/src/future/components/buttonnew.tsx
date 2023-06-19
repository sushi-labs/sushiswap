import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { classNames } from '../../index'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-blue text-white',
        destructive: 'bg-red text-white',
        outline: 'border dark:border-slate-200/5 border-gray-900/5',
        secondary: 'bg-white dark:bg-slate-800',
        ghost:
          'bg-black/[0.04] hover:bg-black/[0.06] focus:bg-black/[0.12] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.16]',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonPropsNew
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ButtonNew = React.forwardRef<HTMLButtonElement, ButtonPropsNew>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={classNames(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
ButtonNew.displayName = 'ButtonNew'

export { ButtonNew, buttonVariants }
