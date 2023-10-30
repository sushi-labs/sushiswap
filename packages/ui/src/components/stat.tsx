import { type VariantProps, cva } from 'class-variance-authority'
import classNames from 'classnames'
import { forwardRef } from 'react'

const statVariants = cva('', {
  variants: {
    size: {
      xs: 'flex flex-col gap-1',
      sm: 'flex flex-col gap-1',
      default: 'flex flex-col gap-1',
      lg: 'flex flex-col gap-1',
      xl: 'flex flex-col gap-1',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface StatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'label' | 'value'>,
    VariantProps<typeof statVariants> {}

const Stat = forwardRef<HTMLDivElement, StatProps>(
  ({ children, className, size }, ref) => {
    return (
      <div ref={ref} className={statVariants({ size, className })}>
        {children}
      </div>
    )
  },
)
Stat.displayName = 'Stat'

const statLabelVariants = cva('text-muted-foreground font-normal', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'default',
    align: 'left',
  },
})

interface StatLabelProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'label' | 'value'>,
    VariantProps<typeof statLabelVariants> {}

const StatLabel = forwardRef<HTMLSpanElement, StatLabelProps>(
  ({ align, children, size, className }, ref) => {
    return (
      <span ref={ref} className={statLabelVariants({ size, align, className })}>
        {children}
      </span>
    )
  },
)
StatLabel.displayName = 'StatLabel'

const statValueVariants = cva('font-medium', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'font-bold text-2xl',
      '3xl': 'font-bold text-3xl',
      '4xl': 'font-bold text-4xl',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'default',
    align: 'left',
  },
})

interface StatValueProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'label' | 'value'>,
    VariantProps<typeof statValueVariants> {}

const StatValue = forwardRef<HTMLSpanElement, StatValueProps>(
  ({ align, children, size, className }, ref) => {
    return (
      <span
        ref={ref}
        className={classNames(statValueVariants({ size, align }), className)}
      >
        {children}
      </span>
    )
  },
)
StatValue.displayName = 'StatValue'

export { Stat, StatLabel, StatValue }
