import * as React from 'react'

import { FantomNaked } from '../naked/FantomNaked'

import { IconComponent } from '../../../types'

export const FantomCircle: IconComponent = (props) => (
  <FantomNaked
    {...props}
    fill="white"
    circle={<rect width={128} height={128} rx={64} fill="#13B5EC" />}
  />
)
