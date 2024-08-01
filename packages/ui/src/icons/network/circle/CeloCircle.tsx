import * as React from 'react'

import { CeloNaked } from '../naked/CeloNaked'

import { IconComponent } from '../../../types'

export const CeloCircle: IconComponent = (props) => (
  <CeloNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="#2E3338" />}
  />
)
