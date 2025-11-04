import * as React from 'react'

import type { IconComponent } from '../../../types'
import { ModeNaked } from '../naked/ModeNaked'

export const ModeSquare: IconComponent = (props) => (
  <ModeNaked
    {...props}
    circle={<rect width="256" height="256" fill="#DFFE00" />}
  />
)
