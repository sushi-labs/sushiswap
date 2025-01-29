import * as React from 'react'

import { OptimismNaked } from '../naked/OptimismNaked'

import type { IconComponent } from '../../../types'

export const OptimismCircle: IconComponent = (props) => (
  <OptimismNaked
    {...props}
    fill="white"
    circle={<rect width={128} height={128} rx={64} fill="#FF0420" />}
  />
)
