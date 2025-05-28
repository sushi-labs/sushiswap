import * as React from 'react'

import { CeloNaked } from '../naked/CeloNaked'

import type { IconComponent } from '../../../types'

export const CeloSquare: IconComponent = (props) => (
  <CeloNaked
    {...props}
    circle={<rect width={128} height={128}  fill="#2E3338" />}
  />
)
