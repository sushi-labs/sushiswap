import * as React from 'react'

import { LineaNaked } from '../naked/LineaNaked'

import { IconComponent } from '../../../types'

export const LineaCircle: IconComponent = (props) => (
  <LineaNaked
    {...props}
    circle={<rect x="0.265137" width="128" height="128" rx="64" fill="black" />}
  />
)
