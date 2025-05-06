import * as React from 'react'

import { ArbitrumNaked } from '../naked/ArbitrumNaked'

import type { IconComponent } from '../../../types'

export const ArbitrumCircle: IconComponent = (props) => (
  <ArbitrumNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="#2D374B" />}
  />
)
