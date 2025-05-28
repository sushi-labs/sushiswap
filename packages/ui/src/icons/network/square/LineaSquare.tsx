import * as React from 'react'

import { LineaNaked } from '../naked/LineaNaked'

import type { IconComponent } from '../../../types'

export const LineaSquare: IconComponent = (props) => (
  <LineaNaked
    {...props}
    circle={<rect x="0.265137" width="128" height="128"  fill="black" />}
  />
)
