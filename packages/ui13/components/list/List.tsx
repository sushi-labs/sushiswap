import classNames from 'classnames'
import { FC, ReactNode } from 'react'

import { ListControl, ListControlProps } from './ListControl'
import { ListItem, ListItemProps } from './ListItem'
import { ListLabel, ListLabelProps } from './ListLabel'

type List<T> = FC<T> & {
  Item: FC<ListItemProps>
  Label: FC<ListLabelProps>
  Control: FC<ListControlProps>
}

export interface ListProps {
  children: ReactNode
  className?: string
}

export const List: List<ListProps> = ({ children, className }) => {
  return <div className={classNames('flex flex-col gap-3', className)}>{children}</div>
}

List.Item = ListItem
List.Label = ListLabel
List.Control = ListControl
