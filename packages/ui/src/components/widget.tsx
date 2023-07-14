import classNames from 'classnames'
import React from 'react'

import { Container, ContainerProps } from './container'

const Widget = React.forwardRef<HTMLDivElement, ContainerProps>(({ id, className, ...props }, ref) => {
  return (
    <Container
      id={id}
      ref={ref}
      className={classNames(
        className,
        'p-6 flex flex-col mx-auto rounded-2xl relative overflow-hidden dark:shadow dark:shadow-slate-900 bg-white dark:bg-slate-800'
      )}
      {...props}
    />
  )
})

Widget.displayName = 'WidgetRoot'

const WidgetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('flex flex-col gap-1.5 text-center sm:text-left mb-4', className)} {...props} />
)
WidgetHeader.displayName = 'WidgetHeader'

const WidgetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('text-lg font-semibold leading-none tracking-tight mr-[64px]', className)} {...props} />
)
WidgetTitle.displayName = 'WidgetTitle'

const WidgetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('text-sm text-muted-foreground mr-[64px]', className)} {...props} />
)
WidgetDescription.displayName = 'WidgetDescription'

const WidgetAction = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('absolute top-6 right-6', className)} {...props} />
)
WidgetAction.displayName = 'WidgetAction'

const WidgetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classNames('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)}
    {...props}
  />
)
WidgetFooter.displayName = 'WidgetFooter'

export { Widget, WidgetAction, WidgetDescription, WidgetFooter, WidgetHeader, WidgetTitle }
