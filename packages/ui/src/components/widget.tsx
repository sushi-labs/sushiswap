import { Slot } from '@radix-ui/react-slot'
import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { Container, ContainerProps } from './container'

const Widget = React.forwardRef<HTMLDivElement, ContainerProps>(({ id, className, ...props }, ref) => {
  return (
    <Container
      id={id}
      ref={ref}
      className={classNames(
        className,
        'p-4 flex flex-col mx-auto rounded-2xl relative overflow-hidden dark:shadow dark:shadow-slate-900 bg-white dark:bg-slate-800'
      )}
      {...props}
    />
  )
})

Widget.displayName = 'WidgetRoot'

interface WidgetContentProps {
  asChild?: boolean
  children: ReactNode
}

const WidgetContent = React.forwardRef<HTMLDivElement, WidgetContentProps>(({ asChild, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp ref={ref} {...props}>
      {children}
    </Comp>
  )
})

WidgetContent.displayName = 'WidgetContent'

interface WidgetHeaderProps {
  asChild?: boolean
  title: ReactNode
  children?: ReactNode
  className?: string
}

const WidgetHeader = React.forwardRef<HTMLDivElement, WidgetHeaderProps>(
  ({ asChild, title, children, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'

    return (
      <Comp ref={ref} className={classNames(className, 'grid grid-cols-2 items-center font-medium')} {...props}>
        <p className="font-medium flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-slate-100 dark:hover:text-slate-200">
          {title}
        </p>
        <div className="flex justify-end">{children}</div>
      </Comp>
    )
  }
)

WidgetHeader.displayName = 'WidgetHeader'

export { Widget, WidgetContent, WidgetHeader }
