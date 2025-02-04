import * as React from 'react'

import { BlastNaked } from '../naked/BlastNaked'

import type { IconComponent } from '../../../types'

export const BlastCircle: IconComponent = (props) => (
  <BlastNaked
    {...props}
    circle={<circle cx="64" cy="64" r="64" fill="black" />}
  />
)
