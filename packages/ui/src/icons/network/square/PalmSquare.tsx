import * as React from 'react'

import { PalmNaked } from '../naked/PalmNaked'

import type { IconComponent } from '../../../types'

export const PalmSquare: IconComponent = (props) => (
  <PalmNaked
    {...props}
    circle={<rect width={128} height={128} fill="white" />}
  />
)
