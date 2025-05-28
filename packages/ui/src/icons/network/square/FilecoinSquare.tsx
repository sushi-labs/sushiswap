import * as React from 'react'

import { FilecoinNaked } from '../naked/FilecoinNaked'

import type { IconComponent } from '../../../types'

export const FilecoinSquare: IconComponent = (props) => (
  <FilecoinNaked
    {...props}
    circle={<rect width={128} height={128}  fill="#0090FF" />}
  />
)
