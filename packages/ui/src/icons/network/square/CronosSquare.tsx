import * as React from 'react'

import { CronosNaked } from '../naked/CronosNaked'

import type { IconComponent } from '../../../types'

export const CronosSquare: IconComponent = (props) => (
  <CronosNaked
    {...props}
    circle={<rect x="0.265137" width="128" height="128" fill="#fff" />}
  />
)
