import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { classNames } from '../../index'
import { Loader2 } from 'lucide-react'
import { IconComponent } from '../types'

const buttonVariants = cva(
  'cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center rounded-xl font-medium transition-colors !ring-0 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-blue hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-600 text-white',
        destructive: 'bg-red hover:bg-red-600 focus:bg-red-700 active:bg-red-600 text-white',
        outline: 'border dark:border-slate-200/5 border-gray-900/5 hover:bg-muted focus:bg-accent',
        secondary: 'bg-secondary hover:bg-muted focus:bg-accent',
        ghost: 'hover:bg-secondary focus:bg-accent',
        link: 'text-blue hover:text-blue-700 font-semibold !p-0 !h-[unset] !min-h-[unset]',
      },
      size: {
        xs: 'min-h-[26px] h-[26px] px-1 text-xs',
        sm: 'min-h-9 h-9 px-3 text-sm',
        default: 'min-h-10 h-10 py-2 px-4 text-sm',
        lg: 'min-h-11 h-11 px-4',
        xl: 'min-h-[52px] h-[52px] px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const buttonLoaderVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'w-4 h-4',
      sm: 'w-[18px] h-[18px]',
      default: 'w-5 h-5',
      lg: 'w-5 h-5 stroke-[2px]',
      xl: 'w-5 h-5 stroke-[2px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const buttonIconVariants = cva('', {
  variants: {
    size: {
      xs: 'w-4 h-4',
      sm: 'w-[18px] h-[18px]',
      default: 'w-5 h-5',
      lg: 'w-5 h-5',
      xl: 'w-5 h-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: IconComponent
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
  testId?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      fullWidth,
      icon: Icon,
      iconProps,
      disabled = false,
      className,
      variant,
      size,
      children,
      asChild = false,
      loading = false,
      testId,
      id,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        disabled={loading ? true : disabled}
        className={classNames(
          buttonVariants({ variant, size, className: classNames(className, fullWidth ? 'flex-1 w-full' : '') })
        )}
        ref={ref}
        {...props}
        testdata-id={`${testId || id}-button`}
      >
        <ButtonContent asChild={asChild}>
          {loading ? (
            <Loader2 className={buttonLoaderVariants({ size })} />
          ) : Icon ? (
            <Icon {...iconProps} className={buttonIconVariants({ size })} />
          ) : null}
          {children}
        </ButtonContent>
      </Comp>
    )
  }
)

Button.displayName = 'Button'

interface ButtonContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const ButtonContent = React.forwardRef<HTMLDivElement, ButtonContentProps>(({ asChild, children, ...props }, ref) => {
  if (asChild) {
    return (
      <div className="inline-flex gap-1" ref={ref} {...props}>
        {children}
      </div>
    )
  }

  return <>{children}</>
})

export { Button, buttonVariants, buttonLoaderVariants, buttonIconVariants }
