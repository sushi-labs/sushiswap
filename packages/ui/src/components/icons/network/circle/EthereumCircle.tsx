import * as React from 'react'

import { IconComponent } from '../../../../types'

export const EthereumCircle: IconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={128} height={128} rx={64} fill="#627EEA" />
    <path
      d="M63.993 24v29.573l24.99 11.169L63.993 24Z"
      fill="#fff"
      fillOpacity={0.602}
    />
    <path d="M63.993 24 39 64.742l24.993-11.17V24Z" fill="#fff" />
    <path
      d="M63.993 83.906V104L89 69.396l-25.007 14.51Z"
      fill="#fff"
      fillOpacity={0.602}
    />
    <path d="M63.993 104V83.902L39 69.396 63.993 104Z" fill="#fff" />
    <path
      d="m63.993 79.255 24.99-14.513-24.99-11.162v25.675Z"
      fill="#fff"
      fillOpacity={0.2}
    />
    <path
      d="m39 64.742 24.993 14.513V53.58L39 64.742Z"
      fill="#fff"
      fillOpacity={0.602}
    />
  </svg>
)
