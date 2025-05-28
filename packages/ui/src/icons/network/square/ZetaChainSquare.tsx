import * as React from 'react'

import { ZetaChainNaked } from '../naked/ZetaChainNaked'

import type { IconComponent } from '../../../types'

export const ZetaChainSquare: IconComponent = (props) => (
  <ZetaChainNaked
    {...props}
    circle={<circle cx="64" cy="64" r="64" fill="#005741" />}
  />
)
