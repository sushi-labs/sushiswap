import type { FC } from 'react'

import { Icon, type IconProps } from './icon'
import { IconList, type IconListProps } from './icon-list'
import { List, type ListComponent } from './list'

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
