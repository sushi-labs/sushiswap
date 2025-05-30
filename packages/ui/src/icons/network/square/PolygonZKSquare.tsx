import * as React from 'react'

import { PolygonZKNaked } from '../naked/PolygonZKNaked'

import type { IconComponent } from '../../../types'

export const PolygonZKSquare: IconComponent = (props) => (
  <PolygonZKNaked
    {...props}
    fill="white"
    circle={<rect width="128" height="128" fill="#8247E5" />}
  />
)
