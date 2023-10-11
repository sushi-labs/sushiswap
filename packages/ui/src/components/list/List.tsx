import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { ListControl, ListControlProps } from './ListControl'
import { ListItem, ListItemComponent } from './ListItem'
import { ListKeyValue, ListKeyValueProps } from './ListKeyValue'
import { ListLabel, ListLabelProps } from './ListLabel'
import { ListMenuItem, ListMenuItemComponent } from './ListMenuItem'

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
