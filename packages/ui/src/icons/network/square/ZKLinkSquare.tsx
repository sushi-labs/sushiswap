import * as React from 'react'

import type { IconComponent } from '../../../types'
import { ZKLinkNaked } from '../naked/ZKLinkNaked'

export const ZKLinkSquare: IconComponent = (props) => (
  <ZKLinkNaked
    {...props}
    circle={<rect width="64" height="64" fill="#000"  />}
  />
)
