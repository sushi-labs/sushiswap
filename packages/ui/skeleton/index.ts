import { FC, HTMLProps } from 'react'

import { Box } from './Box'
import { Circle, CircleProps } from './Circle'

export const Skeleton: { Box: FC<HTMLProps<HTMLDivElement>>; Circle: FC<CircleProps> } = {
  Box: Box,
  Circle: Circle,
}
