import { AvalancheNaked } from '../naked/AvalancheNaked'

import type { IconComponent } from '../../../types'

export const AvalancheSquare: IconComponent = (props) => (
  <AvalancheNaked
    {...props}
    fill="#FFFFFF"
    circle={<rect width={128} height={128} fill="#E84142" />}
  />
)
