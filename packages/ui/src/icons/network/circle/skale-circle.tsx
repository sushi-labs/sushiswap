import * as React from 'react'

import { SkaleNaked } from '../naked/skale-naked'

import type { IconComponent } from '../../../types'

export const SkaleCircle: IconComponent = (props) => (
  <SkaleNaked
    {...props}
    fill="white"
    circle={<circle cx="64" cy="64" r="64" fill="black" />}
  />
)
