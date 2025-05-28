import * as React from 'react'

import { MantleNaked } from '../naked/MantleNaked'

import type { IconComponent } from '../../../types'

export const MantleSquare: IconComponent = (props) => (
  <MantleNaked
    {...props}
    circle={<rect width="128" height="128"  fill="#000" />}
  />
)
