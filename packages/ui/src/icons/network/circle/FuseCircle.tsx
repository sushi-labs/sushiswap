import * as React from 'react'

import { FuseNaked } from '../naked/FuseNaked'

import type { IconComponent } from '../../../types'

export const FuseCircle: IconComponent = (props) => (
  <FuseNaked
    {...props}
    circle={<rect fill="#b4f9ba" rx={64} width={128} height={128} />}
  />
)
