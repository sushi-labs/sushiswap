import * as React from 'react'

import { HyperEVMNaked } from '../naked/HyperEVMNaked'

import type { IconComponent } from '../../../types'

export const HyperEVMCircle: IconComponent = (props) => (
  <HyperEVMNaked
    {...props}
    circle={<circle cx="72" cy="72" r="72" fill="#102623" />}
  />
)
