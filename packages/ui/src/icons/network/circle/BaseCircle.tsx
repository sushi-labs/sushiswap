import * as React from 'react'

import { BaseNaked } from '../naked/BaseNaked'

import type { IconComponent } from '../../../types'

export const BaseCircle: IconComponent = (props) => (
  <BaseNaked
    {...props}
    circle={<rect width="128" height="128" rx="64" fill="#2151F5" />}
  />
)
