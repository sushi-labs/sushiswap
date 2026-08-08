import * as React from 'react'

import { BeraNaked } from '../naked/bera-naked'

import type { IconComponent } from '../../../types'

export const BeraCircle: IconComponent = (props) => (
  <BeraNaked {...props} circle />
)
