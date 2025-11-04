import * as React from 'react'

import type { IconComponent } from '../../../types'
import { TaikoNaked } from '../naked/TaikoNaked'

export const TaikoSquare: IconComponent = (props) => (
  <TaikoNaked
    {...props}
    circle={<rect width="256" height="256" fill="#eb1b9b" />}
  />
)
