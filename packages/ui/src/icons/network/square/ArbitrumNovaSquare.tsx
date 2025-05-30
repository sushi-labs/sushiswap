import { ArbitrumNovaNaked } from '../naked/ArbitrumNovaNaked'

import type { IconComponent } from '../../../types'

export const ArbitrumNovaSquare: IconComponent = (props) => (
  <ArbitrumNovaNaked
    {...props}
    circle={<rect width={128} height={128} fill="#2D374B" />}
  />
)
