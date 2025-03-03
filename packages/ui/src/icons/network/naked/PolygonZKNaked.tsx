import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const PolygonZKNaked: NakedNetworkIconComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    fill="url(#paint0_linear_4864_1937)"
    transform="scale(-1 1)"
    {...props}
  >
    {props.circle}
    <g clipPath="url(#a)">
      <path d="M84.417 50.313c-1.459-.835-3.334-.835-5 0L67.75 57.21l-7.917 4.388-11.458 6.896c-1.458.835-3.333.835-5 0l-8.958-5.433c-1.459-.836-2.5-2.508-2.5-4.388V48.224c0-1.672.833-3.343 2.5-4.388l8.958-5.224c1.458-.836 3.333-.836 5 0l8.958 5.433c1.459.836 2.5 2.507 2.5 4.388v6.895l7.917-4.597v-7.104c0-1.672-.833-3.343-2.5-4.388l-16.667-9.821c-1.458-.836-3.333-.836-5 0L26.5 39.448c-1.667.836-2.5 2.507-2.5 4.179v19.642c0 1.671.833 3.343 2.5 4.388l16.875 9.82c1.458.836 3.333.836 5 0l11.458-6.686 7.917-4.597 11.458-6.687c1.459-.835 3.334-.835 5 0l8.959 5.224c1.458.836 2.5 2.508 2.5 4.388v10.448c0 1.672-.834 3.343-2.5 4.388l-8.75 5.224c-1.459.836-3.334.836-5 0l-8.959-5.224c-1.458-.836-2.5-2.507-2.5-4.388v-6.686l-7.916 4.597v6.895c0 1.672.833 3.343 2.5 4.388l16.875 9.821c1.458.836 3.333.836 5 0l16.875-9.82c1.458-.837 2.5-2.508 2.5-4.389v-19.85c0-1.672-.834-3.344-2.5-4.389l-16.875-9.82Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" transform="translate(24 29)" d="M0 0h80v70H0z" />
      </clipPath>
      <linearGradient
        id="paint0_linear_4864_1937"
        x1="7.0183"
        y1="50.2157"
        x2="58.756"
        y2="12.4902"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A726C1" />
        <stop offset="0.88" stopColor="#803BDF" />
        <stop offset="1" stopColor="#7B3FE4" />
      </linearGradient>
    </defs>
  </svg>
)
