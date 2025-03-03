import { XMarkIcon } from '@heroicons/react/20/solid'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'
import type { IconComponent } from '../types'

const chipVariants = cva(
  'whitespace-nowrap inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-blue hover:bg-blue-600 focus:bg-blue-700 border-transparent text-primary-foreground',
        secondary:
          'bg-secondary hover:bg-muted focus:bg-accent border-transparent text-secondary-foreground',
        destructive:
          'bg-red hover:bg-red-600 focus:bg-red-700 border-transparent text-destructive-foreground',
        ghost: 'hover:bg-muted focus:bg-accent',
        outline: 'text-foreground',
        pink: 'bg-pink/10 text-pink',
        blue: 'bg-blue/10 text-blue',
        green: 'bg-green/10 text-green',
      },
      hasRemove: {
        yes: 'pr-0.5',
        no: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof chipVariants>, 'hasRemove'> {
  icon?: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  onClose?: () => void
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    { className, variant, icon: Icon, onClose, iconProps, children, ...props },
    ref,
  ) => {
    return (
      <div
        className={classNames(
          chipVariants({
            variant,
            className: classNames(
              className,
              'flex items-center gap-1 flex-nowrap',
            ),
            hasRemove: onClose ? 'yes' : 'no',
          }),
        )}
        ref={ref}
        {...props}
      >
        {Icon ? <Icon {...iconProps} width={12} height={12} /> : null}
        <span>{children}</span>
        {onClose ? (
          <div
            onClick={onClose}
            onKeyDown={onClose}
            className="p-0.5 bg-secondary hover:bg-accent rounded-full cursor-pointer"
          >
            <XMarkIcon width={12} height={12} />
          </div>
        ) : null}
      </div>
    )
  },
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
