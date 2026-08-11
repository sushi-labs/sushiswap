import React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const ThunderCoreNaked: NakedNetworkIconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      fill="url(#paint0_linear_901_118)"
      viewBox="0 0 128 128"
      {...props}
    >
      {props.circle}
      <path d="M41.472 61.57a1.792 1.792 0 00.59 2.473c.269.161.575.246.888.247h19.97a.829.829 0 01.735.436.86.86 0 01-.021.864l-19.6 31.845a.705.705 0 01-.445.325.691.691 0 01-.54-.1c-7.062-4.63-12.482-11.426-15.471-19.4a40.604 40.604 0 01-1.145-24.93c2.245-8.221 7.018-15.5 13.625-20.776A39.113 39.113 0 0163.16 24a.686.686 0 01.614.357.712.712 0 01-.013.718L41.472 61.57zm45.033-30.725a.683.683 0 00-.985.215l-19.3 31.375a.862.862 0 00-.022.862.845.845 0 00.732.438H86.9c.312 0 .619.086.887.247.27.161.49.393.642.67a1.796 1.796 0 01-.051 1.803l-22.576 36.69a.566.566 0 00.204.787.546.546 0 00.288.067 39.11 39.11 0 0022.685-8.683c6.476-5.239 11.163-12.413 13.398-20.505a40.6 40.6 0 00-.947-24.585c-2.85-7.89-8.075-14.671-14.934-19.381h.01z" />
      <defs>
        <linearGradient
          id="paint0_linear_901_118"
          x1="59.042"
          x2="73.293"
          y1="40.51"
          y2="100.847"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.18" stopColor="#00FFD5" />
          <stop offset="0.23" stopColor="#00F8D5" />
          <stop offset="0.31" stopColor="#00E4D5" />
          <stop offset="0.4" stopColor="#00C3D5" />
          <stop offset="0.51" stopColor="#0096D5" />
          <stop offset="0.62" stopColor="#005CD5" />
          <stop offset="0.74" stopColor="#0016D5" />
          <stop offset="0.78" stopColor="#0000D5" />
        </linearGradient>
      </defs>
    </svg>
  )
}
