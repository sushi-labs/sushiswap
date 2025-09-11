import * as React from 'react'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'
import { TronNaked } from '../naked/TronNaked'

export const TronSquare: IconComponent = (props) => (
  <TronNaked
    {...props}
    className={classNames(props.className, '!text-white')}
    circle={<rect width={96} height={96} fill="#ff060a" />}
  />
)
