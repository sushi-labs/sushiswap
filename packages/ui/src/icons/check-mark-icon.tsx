import React from 'react'

import { classNames } from '../index'
import type { IconComponent } from '../types'

export const CheckMarkIcon: IconComponent = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <circle
        fillOpacity="0"
        className={classNames(
          'circle animate-grow origin-center text-green',
          props.className,
        )}
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
        d="M14 27l5.917 4.917L34 17"
        style={{ animationDelay: '600ms' }}
      />
    </svg>
  )
}
