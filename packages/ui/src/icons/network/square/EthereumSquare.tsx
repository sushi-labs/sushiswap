import * as React from 'react'

import { EthereumNaked } from '../naked/EthereumNaked'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'

export const EthereumSquare: IconComponent = (props) => (
  <EthereumNaked
    {...props}
    className={classNames(props.className, 'text-white')}
    circle={<rect  width={128} height={128} fill="#627EEA" />}
  />
)
