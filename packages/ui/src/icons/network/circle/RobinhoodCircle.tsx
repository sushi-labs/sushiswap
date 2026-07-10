import * as React from 'react'

import { RobinhoodNaked } from '../naked/RobinhoodNaked'

import type { IconComponent } from '../../../types'

export const RobinhoodCircle: IconComponent = (props) => (
  <RobinhoodNaked {...props} circle />
)
