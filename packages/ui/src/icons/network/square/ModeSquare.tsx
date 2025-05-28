import * as React from 'react'

import type { IconComponent } from '../../../types'
import { ModeNaked } from '../naked/ModeNaked'

export const ModeSquare: IconComponent = (props) => (
  <ModeNaked
    {...props}
    circle={<circle cx="128" cy="128" r="128" fill="#DFFE00" />}
  />
)
