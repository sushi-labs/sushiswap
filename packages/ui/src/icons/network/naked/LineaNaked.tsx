import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const LineaNaked: NakedNetworkIconComponent = (props) => (
  <svg
    {...props}
    viewBox="0 0 129 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {props.circle}
    <mask
      id="mask0_1001_65"
      style={{ maskType: 'luminance' }}
      maskUnits="userSpaceOnUse"
      x="34"
      y="21"
      width="72"
      height="72"
    >
      <path d="M105.082 21H34.2651V93H105.082V21Z" fill="white" />
    </mask>
    <g mask="url(#mask0_1001_65)">
      <path
        d="M93.0782 93H34.2651V32.6832H47.7217V81.3103H93.0782V92.9935V93Z"
        fill="white"
      />
      <path
        d="M93.0785 44.3664C99.7078 44.3664 105.082 39.1356 105.082 32.6832C105.082 26.2308 99.7078 21 93.0785 21C86.4493 21 81.0752 26.2308 81.0752 32.6832C81.0752 39.1356 86.4493 44.3664 93.0785 44.3664Z"
        fill="white"
      />
    </g>
  </svg>
)
