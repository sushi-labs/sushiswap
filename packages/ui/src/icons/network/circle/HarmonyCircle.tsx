import * as React from 'react'

import { HarmonyNaked } from '../naked/HarmonyNaked'

import type { IconComponent } from '../../../types'

export const HarmonyCircle: IconComponent = (props) => (
  <HarmonyNaked
    {...props}
    fill="#FFFFFF"
    circle={
      <>
        <rect width="128" height="128" fill="#fff" rx="64" />
        <rect
          width="128"
          height="128"
          fill="url(#paint0_linear_301_2)"
          rx="64"
        />
        <defs>
          <linearGradient
            id="paint0_linear_301_2"
            x1="8.107"
            x2="119.469"
            y1="118.464"
            y2="7.104"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00AEE9" />
            <stop offset="1" stopColor="#69FABD" />
          </linearGradient>
        </defs>
      </>
    }
  />
)
