import * as React from 'react'

import { FuseNaked } from '../naked/FuseNaked'

import type { IconComponent } from '../../../types'

export const FuseSquare: IconComponent = (props) => (
  <FuseNaked
    {...props}
    circle={<rect fill="#b4f9ba" width={128} height={128} />}
  />
)
