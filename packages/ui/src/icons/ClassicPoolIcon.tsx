import React from 'react'

import type { IconComponent } from '../types'

export const ClassicPoolIcon: IconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        stroke="url(#paint0_linear_3959_23219)"
        strokeWidth="1.5"
        d="M9.795 15.79a5.995 5.995 0 100-11.99 5.995 5.995 0 000 11.99z"
      />
      <path
        stroke="url(#paint1_linear_3959_23219)"
        strokeWidth="1.5"
        d="M22.076 28.07a5.995 5.995 0 100-11.99 5.995 5.995 0 000 11.99z"
      />
      <path
        stroke="url(#paint2_linear_3959_23219)"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M22.417 4.564L9.567 27.08"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3959_23219"
          x1="2.878"
          x2="17.827"
          y1="3.8"
          y2="7.451"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3959_23219"
          x1="15.158"
          x2="30.107"
          y1="16.08"
          y2="19.731"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_3959_23219"
          x1="8.579"
          x2="25.231"
          y1="4.564"
          y2="6.885"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default ClassicPoolIcon
