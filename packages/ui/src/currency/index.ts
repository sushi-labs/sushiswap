import { FC } from 'react'

import { Icon, IconProps } from './Icon'
import { IconList, IconListProps } from './IconList'
import { List, ListProps } from './List'

type Currency = {
  List: FC<ListProps>
  Icon: FC<IconProps>
  IconList: FC<IconListProps>
}

/**
 * @deprecated
 */
export const Currency: Currency = {
  List,
  Icon,
  IconList,
}
