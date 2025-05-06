import * as React from 'react'

import { MoonriverNaked } from '../naked/MoonriverNaked'

import type { IconComponent } from '../../../types'

export const MoonriverCircle: IconComponent = (props) => (
  <MoonriverNaked
    {...props}
    circle={
      <>
        <rect
          width="128"
          height="128"
          fill="url(#paint0_radial_303_494)"
          rx="64"
        />
        <defs>
          <radialGradient
            id="paint0_radial_303_494"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="rotate(90 0 64) scale(85.5)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3F398D" />
            <stop offset="1" stopColor="#3F1262" />
          </radialGradient>
          <clipPath id="clip0_303_494">
            <path fill="#fff" d="M0 0H62V79H0z" transform="translate(33 25)" />
          </clipPath>
        </defs>
      </>
    }
  />
)
