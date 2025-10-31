import * as React from 'react'

import { ZKSyncNaked } from '../naked/ZKSyncNaked'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'

export const ZKSyncSquare: IconComponent = (props) => (
  <ZKSyncNaked
    {...props}
    className={classNames(props.className, 'text-white')}
    circle={<rect width="128" height="128" fill="#000" />}
  />
)
