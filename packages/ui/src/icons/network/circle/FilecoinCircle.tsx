import * as React from 'react'

import { FilecoinNaked } from '../naked/FilecoinNaked'

import type { IconComponent } from '../../../types'

export const FilecoinCircle: IconComponent = (props) => (
  <FilecoinNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="#0090FF" />}
  />
)
