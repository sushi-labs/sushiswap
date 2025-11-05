import { SonicNaked } from '../naked/SonicNaked'

import type { IconComponent } from '../../../types'

export const SonicSquare: IconComponent = (props) => (
  <SonicNaked
    circle={<rect width="128" height="128" fill="white" />}
    {...props}
  />
)
