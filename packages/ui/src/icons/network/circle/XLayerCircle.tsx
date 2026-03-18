import * as React from 'react'

import { XLayerNaked } from '../naked/XLayerNaked'

import type { IconComponent } from '../../../types'

export const XLayerCircle: IconComponent = (props) => (
  <XLayerNaked {...props} circle={<circle />} />
)
