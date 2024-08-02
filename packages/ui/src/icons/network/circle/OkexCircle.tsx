import * as React from 'react'

import { OkexNaked } from '../naked/OkexNaked'

import { IconComponent } from '../../../types'

export const OkexCircle: IconComponent = (props) => (
  <OkexNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="black" />}
  />
)
