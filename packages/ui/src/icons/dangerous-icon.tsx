import React from 'react'

import type { IconComponent } from '../types'

export const DangerousIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.375 27.5L0.5 19.625V8.375L8.375 0.5H19.625L27.5 8.375V19.625L19.625 27.5H8.375ZM9.725 20.375L14 16.1L18.275 20.375L20.375 18.275L16.1 14L20.375 9.725L18.275 7.625L14 11.9L9.725 7.625L7.625 9.725L11.9 14L7.625 18.275L9.725 20.375Z"
        fill="#FF3838"
      />
    </svg>
  )
}
