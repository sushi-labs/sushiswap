import * as React from 'react'

import { OptimismNaked } from '../naked/OptimismNaked'

import type { IconComponent } from '../../../types'

export const OptimismSquare: IconComponent = (props) => (
  <OptimismNaked
    {...props}
    fill="white"
    circle={<rect width={128} height={128}  fill="#FF0420" />}
  />
)
