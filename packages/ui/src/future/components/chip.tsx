import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { classNames } from '../../index'

const chipVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
        secondary: 'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
        destructive: 'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
        ghost:
          'bg-black/[0.04] hover:bg-black/[0.06] focus:bg-black/[0.12] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:focus:bg-white/[0.16]',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: BadgeProps) {
  return <div className={classNames(chipVariants({ variant }), className)} {...props} />
}

export { Chip, chipVariants }
