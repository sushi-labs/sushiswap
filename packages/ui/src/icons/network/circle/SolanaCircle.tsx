import * as React from 'react'

import { SolanaNaked } from '../naked/SolanaNaked'

import type { IconComponent } from '../../../types'

export const SolanaCircle: IconComponent = (props) => (
  <SolanaNaked
    {...props}
    circle={<circle cx="128" cy="128" r="128" fill="#000" />}
  />
)
