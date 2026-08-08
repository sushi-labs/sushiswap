import classNames from 'classnames'
import React, { type FC, type ReactNode } from 'react'

import { ListControl, type ListControlProps } from './list-control'
import { ListItem, type ListItemComponent } from './list-item'
import { ListKeyValue, type ListKeyValueProps } from './list-key-value'
import { ListLabel, type ListLabelProps } from './list-label'
import { ListMenuItem, type ListMenuItemComponent } from './list-menu-item'

type List<T> = FC<T> & {
  Item: ListItemComponent
  MenuItem: ListMenuItemComponent
  Label: FC<ListLabelProps>
  Control: FC<ListControlProps>
  KeyValue: FC<ListKeyValueProps>
}

export interface ListProps {
  children: ReactNode
  className?: string
}

export const List: List<ListProps> = ({ children, className }) => {
  return (
    <div className={classNames('flex flex-col gap-3 pt-3', className)}>
      {children}
    </div>
  )
}

List.Item = ListItem
List.MenuItem = ListMenuItem
List.Label = ListLabel
List.Control = ListControl
List.KeyValue = ListKeyValue
