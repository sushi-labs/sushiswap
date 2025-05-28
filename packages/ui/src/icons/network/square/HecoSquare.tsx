import * as React from 'react'

import { HecoNaked } from '../naked/HecoNaked'

import type { IconComponent } from '../../../types'

export const HecoSquare: IconComponent = (props) => (
  <HecoNaked
    {...props}
    circle={<rect width={128} height={128}  fill="white" />}
  />
)
