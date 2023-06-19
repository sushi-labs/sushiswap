import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from './buttonnew'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { classNames } from '../../index'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon(props: React.ComponentProps<'svg'>): JSX.Element | null
  iconProps: Omit<React.ComponentProps<'svg'>, 'width' | 'height'> & {
    width: number
    height: number
    transparent?: boolean
  }
  name: string
  asChild?: boolean
  description?: string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon: Icon, iconProps, description, size = 'sm', name, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const icon = (
      <Comp
        className={buttonVariants({
          size: size,
          variant: 'ghost',
          className: classNames(
            className,
            '!rounded-full dark:text-slate-50 text-gray-900 !p-0 aspect-square',
            size === 'sm' ? 'w-9' : '',
            size === 'default' ? 'w-10' : '',
            size === 'lg' ? 'w-11' : ''
          ),
        })}
        ref={ref}
        {...props}
      >
        <Icon {...iconProps} />
        <span className="sr-only">{name}</span>
      </Comp>
    )

    if (description) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return icon
  }
)
IconButton.displayName = 'ButtonNew'

export { IconButton }
