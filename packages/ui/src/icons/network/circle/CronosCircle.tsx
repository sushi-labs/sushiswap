import * as React from 'react'

import { CronosNaked } from '../naked/CronosNaked'

import { IconComponent } from '../../../types'

export const CronosCircle: IconComponent = (props) => (
  <CronosNaked
    {...props}
    circle={<rect x="0.265137" width="128" height="128" rx="64" fill="#fff" />}
  />
)
