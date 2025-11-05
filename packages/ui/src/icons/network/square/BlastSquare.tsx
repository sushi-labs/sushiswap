import * as React from 'react'

import { BlastNaked } from '../naked/BlastNaked'

import type { IconComponent } from '../../../types'

export const BlastSquare: IconComponent = (props) => (
  <BlastNaked
    {...props}
    circle={<rect width="256" height="256" fill="black" />}
  />
)
