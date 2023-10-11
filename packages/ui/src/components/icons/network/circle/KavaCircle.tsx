import * as React from 'react'

import { IconComponent } from '../../../../types'

export const KavaCircle: IconComponent = (props) => (
  <svg
    {...props}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="128" height="128" rx="64" fill="#FF433E" />
    <g clipPath="url(#clip0_101_2044)">
      <path d="M43.0347 24H29.0693V104H43.0347V24Z" fill="white" />
      <path
        d="M81.208 104L50.6184 64L81.208 24H98.7109L68.5375 64L98.7109 104H81.208Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_101_2044">
        <rect
          width="69.5954"
          height="80"
          fill="white"
          transform="translate(29 24)"
        />
      </clipPath>
    </defs>
  </svg>
)
