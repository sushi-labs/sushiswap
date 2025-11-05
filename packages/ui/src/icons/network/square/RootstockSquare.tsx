import * as React from 'react'

import { RootstockNaked } from '../naked/RootstockNaked'

import type { IconComponent } from '../../../types'

export const RootstockSquare: IconComponent = (props) => (
  <RootstockNaked
    {...props}
    circle={<rect width="256" height="256" fill="black" />}
  />
)
