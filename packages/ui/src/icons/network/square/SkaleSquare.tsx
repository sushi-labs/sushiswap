import * as React from 'react'

import { SkaleNaked } from '../naked/SkaleNaked'

import type { IconComponent } from '../../../types'

export const SkaleSquare: IconComponent = (props) => (
  <SkaleNaked
    {...props}
    fill="white"
    circle={<rect width="256" height="256" fill="black" />}
  />
)
