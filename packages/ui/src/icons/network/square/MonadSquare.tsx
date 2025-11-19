import * as React from 'react'

import { MonadNaked } from '../naked/MonadNaked'

import type { IconComponent } from '../../../types'

export const MonadSquare: IconComponent = (props) => (
  <MonadNaked
    circle={<rect width="126.609" height="128" className="fill-background" />}
    {...props}
  />
)
