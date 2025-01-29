import classNames from 'classnames'
import React, { type FC, type ReactNode } from 'react'

import { ListControl, type ListControlProps } from './ListControl'
import { ListItem, type ListItemComponent } from './ListItem'
import { ListKeyValue, type ListKeyValueProps } from './ListKeyValue'
import { ListLabel, type ListLabelProps } from './ListLabel'
import { ListMenuItem, type ListMenuItemComponent } from './ListMenuItem'

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
