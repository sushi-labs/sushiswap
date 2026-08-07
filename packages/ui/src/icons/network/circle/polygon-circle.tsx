import * as React from 'react'

import { PolygonNaked } from '../naked/polygon-naked'

import type { IconComponent } from '../../../types'

export const PolygonCircle: IconComponent = (props) => (
  <PolygonNaked
    {...props}
    fill="white"
    circle={<rect width={128} height={128} rx={64} fill="#8247E5" />}
  />
)
