import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { IconComponent } from '../types'
import { Button, buttonVariants } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  name: string
  description?: string
  testId?: string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ description, variant = 'secondary', name, ...props }, ref) => {
    const button = (
      <Button variant={variant} ref={ref} {...props}>
        <span className="sr-only">{name}</span>
      </Button>
    )

    if (description) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }
)
IconButton.displayName = 'ButtonNew'

export { IconButton }
