import * as React from 'react'

import { PlasmaNaked } from '../naked/PlasmaNaked'

import type { IconComponent } from '../../../types'

export const PlasmaCircle: IconComponent = (props) => (
  <PlasmaNaked
    {...props}
    circle={<circle cx="64" cy="64" r="64" fill="#162F29" />}
  />
)
