import * as React from 'react'

import { ArbitrumNovaNaked } from '../naked/ArbitrumNovaNaked'

import type { IconComponent } from '../../../types'

export const ArbitrumNovaCircle: IconComponent = (props) => (
  <ArbitrumNovaNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="#2D374B" />}
  />
)
