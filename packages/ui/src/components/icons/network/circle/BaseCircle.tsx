import * as React from 'react'

import { IconComponent } from '../../../../types'

export const BaseCircle: IconComponent = (props) => (
  <svg
    width="128"
    height="128"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="128" height="128" rx="64" fill="#2151F5" />
    <circle cx="64" cy="64" r="64" fill="#2151F5" />
    <path
      d="M63.9184 110.385C89.5825 110.385 110.385 89.6194 110.385 63.9998C110.385 38.3803 89.5825 17.6145 63.9184 17.6145C39.5717 17.6145 19.6 36.3096 17.6147 60.0997H79.0326V67.8999H17.6147C19.6 91.69 39.5717 110.385 63.9184 110.385Z"
      fill="white"
    />
  </svg>
)
