import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import type { IconComponent } from '../types'
import { buttonIconVariants, type buttonVariants } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

const iconButtonVariants = cva(
  'rounded-full cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-blue',
  {
    variants: {
      variant: {
        default:
          'bg-blue hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-600 text-white',
        destructive:
          'bg-red hover:bg-red-600 focus:bg-red-700 active:bg-red-600 text-white',
        warning:
          'bg-amber-400 hover:bg-amber-500 focus:bg-amber-600 active:bg-amber-500 text-amber-900',
        outline:
          'border dark:border-slate-200/5 border-gray-900/5 hover:bg-muted focus:bg-accent',
        secondary: 'bg-secondary hover:bg-muted focus:bg-accent',
        ghost: 'hover:bg-secondary focus:bg-accent',
        link: 'text-blue hover:text-blue-700 font-semibold !p-0 !h-[unset] !min-h-[unset]',
        blank: '',
      },
      size: {
        xs: 'min-h-[26px] h-[26px] min-w-[26px] w-[26px] text-xs',
        sm: 'min-h-[36px] h-[36px] min-w-[36px] w-[36px] text-sm',
        default: 'min-h-[40px] h-[40px] min-w-[40px] w-[40px] text-sm',
        lg: 'min-h-[44px] h-[44px] min-w-[44px] w-[44px',
        xl: 'min-h-[52px] h-[52px] min-w-[52px] w-[52px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: IconComponent | string
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  name: string
  description?: string
  testId?: string
  asChild?: boolean
  children?: React.ReactNode
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      children,
      asChild,
      icon: Icon,
      iconProps,
      description,
      size,
      variant = 'secondary',
      name: _name,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'span'

    const button = (
      <Comp
        role="button"
        className={iconButtonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {typeof Icon === 'string' ? (
          <span
            className={buttonIconVariants({
              size,
              className: iconProps?.className,
            })}
          >
            {Icon}
          </span>
        ) : (
          <Icon
            {...iconProps}
            className={buttonIconVariants({
              size,
              className: iconProps?.className,
            })}
          />
        )}
        {children ? children : null}
      </Comp>
    )

    if (description) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  },
)
IconButton.displayName = 'ButtonNew'

export { IconButton, iconButtonVariants }
