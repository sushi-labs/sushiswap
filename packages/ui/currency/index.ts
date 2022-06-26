import { FC } from 'react'

import { Icon, IconProps } from './Icon'
import { List, ListProps } from './List'

type Currency = {
  List: FC<ListProps>
  Icon: FC<IconProps>
}

export const Currency: Currency = {
  List,
  Icon,
}
