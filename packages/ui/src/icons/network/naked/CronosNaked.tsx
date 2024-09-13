import React from 'react'

import { NakedNetworkIconComponent } from '../../../types'

export const CronosNaked: NakedNetworkIconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {props.circle}
      <path
        d="M117.341 94.496 64 125.312 10.66 94.496V33.504L64 2.688l53.341 30.816z"
        fill="#fff"
      />
      <path
        d="M64.02 8.8 16 36.41v55.2l48.02 27.59L112 91.61v-55.2zm33.762 74.63L64.02 102.842 30.234 83.43V44.57l33.785-19.412L97.782 44.57z"
        fill="#002D74"
      />
      <path
        style={{ mixBlendMode: 'multiply' }}
        d="m64.02 119.201 47.981-27.59V36.41L64.021 8.799v16.379l33.764 19.41v38.86L64.02 102.844z"
        fill="url(#a)"
      />
      <path
        style={{ mixBlendMode: 'multiply' }}
        d="m63.989 8.799-47.981 27.59V91.59l47.98 27.611v-16.379l-33.765-19.41v-38.86L63.99 25.156z"
        fill="url(#b)"
      />
      <path
        d="M86.41 76.896 64 89.782l-22.432-12.88V51.123L64 38.227l22.41 12.896-9.328 5.367L64 48.96l-13.085 7.53v15.027L64 79.047l13.082-7.533z"
        fill="#002D74"
      />
      <defs>
        <linearGradient
          id="a"
          x1="88.01"
          y1="119.201"
          x2="88.01"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#002D74" />
          <stop offset="1" stopColor="#002D74" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="39.998"
          y1="8.799"
          x2="39.998"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#002D74" />
          <stop offset="1" stopColor="#002D74" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
