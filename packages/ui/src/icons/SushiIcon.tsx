import React from 'react'

import type { IconComponent } from '../types'

export const SushiIcon: IconComponent = (props) => {
  const id = React.useId()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 990 916"
    >
      <path
        fill={`url(#sushi-${id})`}
        fillRule="evenodd"
        d="M969.311 593.493l-193.11 269.99c-28.12 39.37-82.96 56.71-152.8 51.09-97.03-8.44-225.93-60-349.2-148.58a975.047 975.047 0 01-113.6-94.36c-65.32-63.44-113.33-129.44-139.04-188.29-28.12-64.68-29.05-121.86-.93-161.23L214.2 52.123c28.13-39.37 82.5-56.71 152.81-51.09 97.03 7.97 225.46 60 349.19 148.12 123.28 88.59 213.75 194.05 252.18 283.11 3.32 7.64 6.26 15.17 8.82 22.59 19.11 55.35 16.91 103.92-7.89 138.64z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M938.381 445.383c-37.03-84.84-123.75-184.68-241.86-269.05-117.65-84.37-239.98-134.52-332.32-142.02-56.25-4.69-100.78 5.63-123.27 37.03l-.95 1.87c-21.09 31.41-16.4 75.94 5.63 126.56 37.03 85.31 123.74 185.14 241.4 269.51 117.64 84.371 239.98 134.53 332.31 142.03 55.31 4.21 98.91-5.629 121.87-35.159l1.41-2.341c22.5-30.94 17.81-76.87-4.22-128.43zm-172.96 1.88c-10.31 14.52-31.4 18.75-57.18 16.4-46.41-3.75-107.34-29.06-166.4-71.24-59.06-42.19-102.65-91.88-120.93-134.53-10.31-23.9-13.12-44.99-2.81-59.53 10.32-14.53 31.41-18.75 57.65-16.87 45.93 4.22 107.34 29.06 165.93 71.25 59.06 42.18 102.65 92.33 120.93 134.99 10.78 23.9 13.59 44.99 2.81 59.53z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id={`sushi-${id}`}
          x1="336.076"
          x2="653.893"
          y1="-11.067"
          y2="926.765"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27B0E6" />
          <stop offset="0.107" stopColor="#49A1DB" />
          <stop offset="0.288" stopColor="#7D8ACA" />
          <stop offset="0.445" stopColor="#A279BD" />
          <stop offset="0.572" stopColor="#BA6FB6" />
          <stop offset="0.651" stopColor="#C26BB3" />
          <stop offset="0.678" stopColor="#D563AD" />
          <stop offset="0.715" stopColor="#E65BA7" />
          <stop offset="0.76" stopColor="#F156A3" />
          <stop offset="0.824" stopColor="#F853A1" />
          <stop offset="1" stopColor="#FA52A0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
