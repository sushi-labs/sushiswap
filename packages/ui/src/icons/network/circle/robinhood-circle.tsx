import * as React from 'react'

import { RobinhoodNaked } from '../naked/robinhood-naked'

import type { IconComponent } from '../../../types'

export const RobinhoodCircle: IconComponent = (props) => (
  <RobinhoodNaked {...props} circle />
)
