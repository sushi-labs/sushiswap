import * as React from 'react'

import { MoonbeamNaked } from '../naked/MoonbeamNaked'

import type { IconComponent } from '../../../types'

export const MoonbeamSquare: IconComponent = (props) => (
  <MoonbeamNaked
    {...props}
    circle={
      <>
        <rect width="128" height="128" fill="url(#paint0_radial_303_506)" />\
        <defs>
          <radialGradient
            id="paint0_radial_303_506"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="rotate(90 0 64) scale(85.5)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3F398D" />
            <stop offset="1" stopColor="#3F1262" />
          </radialGradient>
        </defs>
      </>
    }
  />
)
