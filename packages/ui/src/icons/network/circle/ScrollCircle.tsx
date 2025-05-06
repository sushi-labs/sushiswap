import * as React from 'react'

import { ScrollNaked } from '../naked/ScrollNaked'

import type { IconComponent } from '../../../types'

export const ScrollCircle: IconComponent = (props) => (
  <ScrollNaked
    {...props}
    circle={
      <rect x="0.265137" width="128" height="128" rx="64" fill="#FFEEDA" />
    }
  />
)
