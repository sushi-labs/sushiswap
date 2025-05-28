import * as React from 'react'

import { KavaNaked } from '../naked/KavaNaked'

import type { IconComponent } from '../../../types'

export const KavaSquare: IconComponent = (props) => (
  <KavaNaked
    {...props}
    fill="white"
    circle={<rect width="128" height="128"  fill="#FF433E" />}
  />
)
