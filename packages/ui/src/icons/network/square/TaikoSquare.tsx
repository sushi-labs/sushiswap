import * as React from 'react'

import type { IconComponent } from '../../../types'
import { TaikoNaked } from '../naked/TaikoNaked'

export const TaikoSquare: IconComponent = (props) => (
  <TaikoNaked
    {...props}
    circle={<circle cx="125" cy="125" r="125" fill="#eb1b9b" />}
  />
)
