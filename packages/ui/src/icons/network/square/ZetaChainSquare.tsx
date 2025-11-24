import { ZetaChainNaked } from '../naked/ZetaChainNaked'

import type { IconComponent } from '../../../types'

export const ZetaChainSquare: IconComponent = (props) => (
  <ZetaChainNaked
    {...props}
    circle={<rect width="256" height="256" fill="#005741" />}
  />
)
