import { ImageProps } from 'next/image'
import { FC } from 'react'

import { Icon, IconProps } from './Icon'
import { IconList, IconListProps } from './IconList'
import { List, ListComponent } from './List'

type Currency = {
  List: ListComponent
  Icon: FC<IconProps>
  IconList: FC<IconListProps>
} & Omit<ImageProps, 'src' | 'alt'>

export const Currency: Currency = {
  List,
  Icon,
  IconList,
}
