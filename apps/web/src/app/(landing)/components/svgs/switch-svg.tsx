import type React from 'react'

export const SwitchSVG = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 40 40"
    >
      <title>Switch</title>
      <path
        fill="url(#paint0_linear_1438_1424)"
        d="M6.668 25V14.169a7.5 7.5 0 0115 0v11.666a4.167 4.167 0 108.333 0V14.717a5.002 5.002 0 113.334 0v11.117a7.5 7.5 0 11-15 0V14.168a4.167 4.167 0 10-8.334 0V25h5l-6.666 8.333-6.667-8.333h5zm25-13.332a1.667 1.667 0 100-3.334 1.667 1.667 0 000 3.334z"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1438_1424"
          x1="19.169"
          x2="19.169"
          y1="5"
          y2="33.334"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#96F9FF" />
          <stop offset="1" stopColor="#EEE" stopOpacity="0.42" />
        </linearGradient>
      </defs>
    </svg>
  )
}
