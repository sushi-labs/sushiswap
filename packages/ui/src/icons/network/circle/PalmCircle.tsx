import * as React from 'react'

import { PalmNaked } from '../naked/PalmNaked'

import type { IconComponent } from '../../../types'

export const PalmCircle: IconComponent = (props) => (
  <PalmNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="white" />}
  />
)
