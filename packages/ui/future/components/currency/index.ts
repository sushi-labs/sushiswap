import { FC } from 'react'

import { Icon, IconProps } from './Icon'
import { IconList, IconListProps } from './IconList'
import { List, ListComponent } from './List'

type Currency = {
  List: ListComponent
  Icon: FC<IconProps>
  IconList: FC<IconListProps>
}

export const Currency: Currency = {
  List,
  Icon,
  IconList,
}
