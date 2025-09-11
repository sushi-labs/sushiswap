import { BaseNaked } from '../naked/BaseNaked'

import type { IconComponent } from '../../../types'

export const BaseSquare: IconComponent = (props) => (
  <BaseNaked
    {...props}
    circle={<rect width="128" height="128" fill="#2151F5" />}
  />
)
