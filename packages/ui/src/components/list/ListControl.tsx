import classNames from 'classnames'
import { FC, ReactNode } from 'react'

import { Card } from '../card'

export interface ListControlProps {
  children: ReactNode
  className?: string
}

export const ListControl: FC<ListControlProps> = ({ children, className }) => {
  return (
    <Card
      className={classNames('!border-none bg-white dark:!bg-secondary rounded-xl overflow-hidden shadow-sm', className)}
    >
      {children}
    </Card>
  )
}
