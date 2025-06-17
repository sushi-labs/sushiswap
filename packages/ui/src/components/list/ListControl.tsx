import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

import { Card } from '../card'

export interface ListControlProps {
  children: ReactNode
  className?: string
}

export const ListControl: FC<ListControlProps> = ({ children, className }) => {
  return (
    <Card
      className={classNames(
        'p-1 border-accent bg-white dark:bg-secondary rounded-xl overflow-hidden black:bg-white black:bg-opacity-[0.02]',
        className,
      )}
    >
      {children}
    </Card>
  )
}
