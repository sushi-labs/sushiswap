import * as React from 'react'

import { MegaETHNaked } from '../naked/mega-eth-naked'

import type { IconComponent } from '../../../types'

export const MegaETHCircle: IconComponent = (props) => (
  <MegaETHNaked {...props} />
)
