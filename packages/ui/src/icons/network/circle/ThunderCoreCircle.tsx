import React from 'react'

import { ThunderCoreNaked } from '../naked/ThunderCoreNaked'

import type { IconComponent } from '../../../types'

export const ThunderCoreCircle: IconComponent = (props) => (
  <ThunderCoreNaked
    {...props}
    fill="white"
    circle={
      <>
        <rect
          width={128}
          height={128}
          rx={64}
          fill="url(#paint0_linear_1413_10030)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1413_10030"
            x1="24"
            y1="14"
            x2="106"
            y2="114"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00FFD5" />
            <stop offset="1" stopColor="#035CD2" />
          </linearGradient>
        </defs>
      </>
    }
  />
)
