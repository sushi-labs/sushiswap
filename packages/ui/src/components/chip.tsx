import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { classNames } from '../index'
import { IconComponent } from '../types'

const chipVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-blue hover:bg-blue-600 focus:bg-blue-700 border-transparent text-primary-foreground',
        secondary: 'bg-secondary hover:bg-muted focus:bg-accent border-transparent text-secondary-foreground',
        destructive: 'bg-red hover:bg-red-600 focus:bg-red-700 border-transparent text-destructive-foreground',
        ghost: 'hover:bg-muted focus:bg-accent',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chipVariants> {
  icon?: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
}

function Chip({ className, variant, icon: Icon, iconProps, children, ...props }: BadgeProps) {
  return (
    <div
      className={classNames(chipVariants({ variant, className: classNames(className, 'flex items-center gap-1') }))}
      {...props}
    >
      {Icon ? <Icon {...iconProps} width={12} height={12} /> : null}
      {children}
    </div>
  )
}

export { Chip, chipVariants }
