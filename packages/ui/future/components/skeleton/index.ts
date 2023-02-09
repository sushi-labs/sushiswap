import { FC, HTMLProps } from 'react'

import { Box } from './Box'
import { Text } from './Text'
import { Circle, CircleProps } from './Circle'
import { TextProps } from './Text'

export const Skeleton: {
  Box: FC<HTMLProps<HTMLDivElement>>
  Circle: FC<CircleProps>
  Text: FC<TextProps>
} = {
  Box: Box,
  Circle: Circle,
  Text: Text,
}
