import * as React from 'react'

import { FantomNaked } from '../naked/FantomNaked'

import type { IconComponent } from '../../../types'

export const FantomSquare: IconComponent = (props) => (
  <FantomNaked
    {...props}
    fill="white"
    circle={<rect width={128} height={128} fill="#13B5EC" />}
  />
)
