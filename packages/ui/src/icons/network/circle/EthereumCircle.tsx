import * as React from 'react'

import { EthereumNaked } from '../naked/EthereumNaked'

import { IconComponent } from '../../../types'

export const EthereumCircle: IconComponent = (props) => (
  <EthereumNaked
    {...props}
    circle={<rect rx={64} width={128} height={128} fill="#627EEA" />}
  />
)
