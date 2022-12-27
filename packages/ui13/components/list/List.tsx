import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { ListControl, ListControlProps } from './ListControl'
import { ListItem, ListItemComponent } from './ListItem'
import { ListLabel, ListLabelProps } from './ListLabel'

type List<T> = FC<T> & {
  Item: ListItemComponent
  Label: FC<ListLabelProps>
  Control: FC<ListControlProps>
}

export interface ListProps {
  children: ReactNode
  className?: string
}

export const List: List<ListProps> = ({ children, className }) => {
  return <div className={classNames('flex flex-col gap-3 pt-3', className)}>{children}</div>
}

List.Item = ListItem
List.Label = ListLabel
List.Control = ListControl
