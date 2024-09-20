import * as React from 'react'

import { MantleNaked } from '../naked/MantleNaked'

import { IconComponent } from '../../../types'

export const MantleCircle: IconComponent = (props) => (
  <MantleNaked
    {...props}
    circle={
      <defs>
        <clipPath id="circle">
          <circle cx="64" cy="64" r="64" />
        </clipPath>
      </defs>
    }
  />
)
