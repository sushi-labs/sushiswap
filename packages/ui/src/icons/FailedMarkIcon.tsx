import React from 'react'

import type { IconComponent } from '../types'

export const FailedMarkIcon: IconComponent = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <circle
        fillOpacity="0"
        className="circle animate-grow origin-center scale-0 text-red"
        stroke="currentColor"
        strokeWidth={16}
        fill="currentColor"
        cx="24"
        cy="24"
        r="22"
      />
      <path
        className="tick animate-draw"
        fill="none"
        stroke="#FFF"
        strokeOpacity={0}
        strokeDasharray={29}
        strokeDashoffset={29}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M 16 32 L 32 16 M 32 32 L 16 16"
        style={{ animationDelay: '600ms' }}
      />
    </svg>
  )
}
