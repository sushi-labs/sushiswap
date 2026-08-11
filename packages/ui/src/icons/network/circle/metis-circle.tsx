import * as React from 'react'

import { MetisNaked } from '../naked/metis-naked'

import type { IconComponent } from '../../../types'

export const MetisCircle: IconComponent = (props) => (
  <MetisNaked
    {...props}
    circle={<rect width="128" height="128" rx="64" fill="#313144" />}
  />
)
