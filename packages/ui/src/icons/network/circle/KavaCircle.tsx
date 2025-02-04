import * as React from 'react'

import { KavaNaked } from '../naked/KavaNaked'

import type { IconComponent } from '../../../types'

export const KavaCircle: IconComponent = (props) => (
  <KavaNaked
    {...props}
    fill="white"
    circle={<rect width="128" height="128" rx="64" fill="#FF433E" />}
  />
)
