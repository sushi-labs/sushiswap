import * as React from 'react'

import { AvalancheNaked } from '../naked/avalanche-naked'

import type { IconComponent } from '../../../types'

export const AvalancheCircle: IconComponent = (props) => (
  <AvalancheNaked
    {...props}
    fill="#FFFFFF"
    circle={<rect width={128} height={128} rx={64} fill="#E84142" />}
  />
)
