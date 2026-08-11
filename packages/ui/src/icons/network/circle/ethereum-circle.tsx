import * as React from 'react'

import { EthereumNaked } from '../naked/ethereum-naked'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'

export const EthereumCircle: IconComponent = (props) => (
  <EthereumNaked
    {...props}
    className={classNames(props.className, 'text-white')}
    circle={<rect rx={64} width={128} height={128} fill="#627EEA" />}
  />
)
