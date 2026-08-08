import type { ImageProps } from 'next/image'
import type { FC } from 'react'

import { Icon, type IconProps } from './icon'
import { IconList, type IconListProps } from './icon-list'
import { List, type ListComponent } from './list'

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
