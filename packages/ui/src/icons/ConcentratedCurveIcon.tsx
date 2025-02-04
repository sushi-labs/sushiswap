import React from 'react'

import type { IconComponent } from '../types'

export const ConcentratedCurveIcon: IconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 30 30"
    >
      <circle
        cx="5.911"
        cy="5.911"
        r="5.161"
        stroke={`url(#paint0_linear_3982_23283_${props.id})`}
        strokeWidth="1.5"
        transform="matrix(-1 0 0 1 19.252 15.727)"
      />
      <circle
        cx="5.911"
        cy="5.911"
        r="5.161"
        stroke={`url(#paint1_linear_3982_23283_${props.id})`}
        strokeWidth="1.5"
        transform="matrix(-1 0 0 1 14.274 10.748)"
      />
      <path
        stroke={`url(#paint2_linear_3982_23283_${props.id})`}
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M1 1c1.106 7.57 8.255 23.769 28 28"
      />
      <defs>
        <linearGradient
          id={`paint0_linear_3982_23283_${props.id}`}
          x1="-0.909"
          x2="13.83"
          y1="0"
          y2="3.599"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_3982_23283_${props.id}`}
          x1="-0.909"
          x2="13.83"
          y1="0"
          y2="3.599"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
        <linearGradient
          id={`paint2_linear_3982_23283_${props.id}`}
          x1="-1.154"
          x2="33.756"
          y1="1"
          y2="9.525"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0993EC" />
          <stop offset="1" stopColor="#F338C3" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default ConcentratedCurveIcon
