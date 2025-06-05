import * as React from 'react'

import { KatanaNaked } from '../naked/KatanaNaked'

import type { IconComponent } from '../../../types'

export const KatanaCircle: IconComponent = (props) => (
  <KatanaNaked
    {...props}
    circle={<rect rx={500} width={1000} height={1000} />}
  />
)
