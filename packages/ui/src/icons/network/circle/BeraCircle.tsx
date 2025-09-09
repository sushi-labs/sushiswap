import * as React from 'react'

import { BeraNaked } from '../naked/BeraNaked'

import type { IconComponent } from '../../../types'

export const BeraCircle: IconComponent = (props) => (
  <BeraNaked {...props} circle />
)
