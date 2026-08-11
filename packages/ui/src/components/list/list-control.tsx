import classNames from 'classnames'
import type { ComponentPropsWithRef } from 'react'
import { Card } from '../card'

export interface ListControlProps extends ComponentPropsWithRef<typeof Card> {}

export const ListControl = ({
  children,
  className,
  ...props
}: ListControlProps) => {
  return (
    <Card
      className={classNames(
        'p-1 border-accent bg-white dark:bg-secondary rounded-xl overflow-hidden black:bg-white black:bg-opacity-[0.02]',
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  )
}
