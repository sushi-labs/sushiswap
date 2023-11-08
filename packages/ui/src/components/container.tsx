import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import classNames from 'classnames'
import React from 'react'

const containerVariants = cva('w-full mx-auto', {
  variants: {
    maxWidth: {
      full: 'max-w-full',
      'screen-sm': 'max-w-screen-sm',
      'screen-md': 'max-w-screen-md',
      'screen-lg': 'max-w-screen-lg',
      'screen-xl': 'max-w-screen-xl',
      'screen-2xl': 'max-w-screen-2xl',
      'screen-3xl': 'max-w-[1792px]',
      'screen-4xl': 'max-w-[2048px]',
      '7xl': 'max-w-7xl',
      '6xl': 'max-w-6xl',
      '5xl': 'max-w-5xl',
      '4xl': 'max-w-4xl',
      '3xl': 'max-w-3xl',
      '2xl': 'max-w-2xl',
      xl: 'max-w-xl',
      lg: 'max-w-lg',
      md: 'max-w-md',
      sm: 'max-w-sm',
      xs: 'max-w-xs',
    },
  },
  defaultVariants: {
    maxWidth: '2xl',
  },
})

export interface ContainerProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  id?: string
  asChild?: boolean
  className?: string
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp
        className={classNames(containerVariants({ maxWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Container.displayName = 'Container'

export { Container, containerVariants }
