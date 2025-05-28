import * as React from 'react'

import { MetisNaked } from '../naked/MetisNaked'

import type { IconComponent } from '../../../types'

export const MetisSquare: IconComponent = (props) => (
  <MetisNaked
    {...props}
    circle={<rect width="128" height="128"  fill="#313144" />}
  />
)
