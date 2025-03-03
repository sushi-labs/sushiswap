import * as React from 'react'

import classNames from 'classnames'
import type { NakedNetworkIconComponent } from '../../../types'

export const TronNaked: NakedNetworkIconComponent = ({ circle, ...props }) => (
  <svg
    viewBox={circle ? '0 0 96 96' : '0 0 64 64'}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill={circle ? 'currentColor' : '#ff060a'}
    className={classNames(props.className)}
  >
    {circle}
    <g transform={circle ? 'translate(20,20)' : ''}>
      <path d="M61.55,19.28c-3-2.77-7.15-7-10.53-10l-.2-.14a3.82,3.82,0,0,0-1.11-.62l0,0C41.56,7,3.63-.09,2.89,0a1.4,1.4,0,0,0-.58.22L2.12.37a2.23,2.23,0,0,0-.52.84l-.05.13v.71l0,.11C5.82,14.05,22.68,53,26,62.14c.2.62.58,1.8,1.29,1.86h.16c.38,0,2-2.14,2-2.14S58.41,26.74,61.34,23a9.46,9.46,0,0,0,1-1.48A2.41,2.41,0,0,0,61.55,19.28ZM36.88,23.37,49.24,13.12l7.25,6.68Zm-4.8-.67L10.8,5.26l34.43,6.35ZM34,27.27l21.78-3.51-24.9,30ZM7.91,7,30.3,26,27.06,53.78Z" />
    </g>
  </svg>
)
