import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const KatanaNaked: NakedNetworkIconComponent = ({
  circle,
  ...props
}) => {
  const id = React.useId()
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="1000"
        height="1000"
        fill={`url(#${id})`}
        rx={circle ? '500' : undefined}
      />
      <path
        d="M485.626 439.896L609.365 223.965H733.107L640.301 533.027H548.279L795.765 656.652L671.249 843.635L485.626 626.29V780.277H269.076L343.321 533.027H269.076L361.883 223.965H485.626V439.896Z"
        fill="#F6FF0D"
      />
      <defs>
        <linearGradient
          id={id}
          x1="500"
          y1="0"
          x2="500"
          y2="1416.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.06" stopColor="#101631" />
          <stop offset="0.39" stopColor="#0541B2" />
          <stop offset="0.57" stopColor="#059EED" />
          <stop offset="0.7" stopColor="#C5EAFC" />
        </linearGradient>
      </defs>
    </svg>
  )
}
