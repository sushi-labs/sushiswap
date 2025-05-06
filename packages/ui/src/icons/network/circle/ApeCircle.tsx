import * as React from 'react'

import { ApeNaked } from '../naked/ApeNaked'

import type { IconComponent } from '../../../types'

export const ApeCircle: IconComponent = (props) => (
  <ApeNaked
    {...props}
    circle={<rect width="30" height="30" rx="15" fill="#fff" />}
  />
)
