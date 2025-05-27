import { classNames } from '../../..'

import { EthereumNaked } from '../naked/EthereumNaked'

import type { IconComponent } from '../../../types'

export const EthereumSquare: IconComponent = (props) => (
  <EthereumNaked
    {...props}
    className={classNames(props.className, 'text-white')}
    circle={
      <rect
        rx={4} // Small rounded corners for "squared" appearance
        width={128}
        height={128}
        fill="#627EEA"
      />
    }
  />
)
