import { type VariantProps, cva } from 'class-variance-authority'
import classNames from 'classnames'
import React from 'react'

import { Container } from './container'

const widgetVariants = cva('flex flex-col relative overflow-hidden', {
  variants: {
    variant: {
      default:
        'mx-auto p-6 dark:shadow dark:shadow-slate-900 bg-white dark:bg-slate-800',
      empty: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const widgetActionVariants = cva('absolute', {
  variants: {
    variant: {
      default: 'top-6 right-6',
      empty: 'top-0 right-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface WidgetProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ variant, id, className, ...props }, ref) => {
    return (
      <Container
        id={id}
        ref={ref}
        className={widgetVariants({ variant, className })}
        {...props}
      />
    )
  },
)

Widget.displayName = 'WidgetRoot'

const WidgetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames(
      'flex flex-col space-y-1.5 text-left mb-4',
      className,
    )}
    {...props}
  />
)
WidgetHeader.displayName = 'WidgetHeader'

const WidgetTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames(
      'text-lg font-semibold leading-none tracking-tight mr-[64px]',
      className,
    )}
    {...props}
  />
)
WidgetTitle.displayName = 'WidgetTitle'

const WidgetDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames('text-sm text-muted-foreground mr-[64px]', className)}
    {...props}
  />
)
WidgetDescription.displayName = 'WidgetDescription'

export interface WidgetActionProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetActionVariants> {}

const WidgetAction = ({ variant, className, ...props }: WidgetActionProps) => (
  <div className={widgetActionVariants({ variant, className })} {...props} />
)
WidgetAction.displayName = 'WidgetAction'

const WidgetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4',
      className,
    )}
    {...props}
  />
)
WidgetFooter.displayName = 'WidgetFooter'

export {
  Widget,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
}
