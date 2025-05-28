import * as React from 'react'

import { PolygonNaked } from '../naked/PolygonNaked'

import type { IconComponent } from '../../../types'

export const PolygonSquare: IconComponent = (props) => (
  <PolygonNaked
    {...props}
    fill="white"
    circle={<rect width={128} height={128}  fill="#8247E5" />}
  />
)
