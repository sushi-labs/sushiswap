import type { ImageProps } from 'next/image'
import type { FC } from 'react'

import { Icon, type IconProps, getIconSrc } from './Icon'
import { IconList, type IconListProps } from './IconList'
import { List, type ListComponent } from './List'

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

export { getIconSrc }
