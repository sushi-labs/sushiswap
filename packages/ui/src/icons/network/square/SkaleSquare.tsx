import * as React from 'react'

import { SkaleNaked } from '../naked/SkaleNaked'

import type { IconComponent } from '../../../types'

export const SkaleSquare: IconComponent = (props) => (
  <SkaleNaked
    {...props}
    fill="white"
    circle={<circle cx="64" cy="64" r="64" fill="black" />}
  />
)
