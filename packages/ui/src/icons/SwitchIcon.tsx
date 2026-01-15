import React from 'react'

import type { IconComponent } from '../types'

export const SwitchIcon: IconComponent = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.74 9.913H6M13.826 6l3.913 3.913M6.26 13.174H18m-11.74 0 3.914 3.913"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
