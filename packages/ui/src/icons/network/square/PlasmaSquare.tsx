import * as React from 'react'

import { PlasmaNaked } from '../naked/PlasmaNaked'

import type { IconComponent } from '../../../types'

export const PlasmaSquare: IconComponent = (props) => (
  <PlasmaNaked
    {...props}
    circle={<rect width={128} height={128} fill="#162F29" />}
  />
)
