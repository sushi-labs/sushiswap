import * as React from 'react'

import { RootstockNaked } from '../naked/RootstockNaked'

import type { IconComponent } from '../../../types'

export const RootstockCircle: IconComponent = (props) => (
  <RootstockNaked
    {...props}
    circle={<circle cx="64" cy="64" r="64" fill="#000" />}
  />
)
