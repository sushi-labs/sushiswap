import * as React from 'react'

import { HecoNaked } from '../naked/HecoNaked'

import type { IconComponent } from '../../../types'

export const HecoCircle: IconComponent = (props) => (
  <HecoNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="white" />}
  />
)
