import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const BlastNaked: NakedNetworkIconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.circle}
    <g>
      <path
        fill="#FCFC03"
        d="M 95.851562 63.34375 L 113.292969 54.652344 L 119.308594 36.199219 L 107.28125 27.445312 L 27.207031 27.445312 L 8.691406 41.199219 L 102.816406 41.199219 L 97.816406 56.675781 L 60.070312 56.675781 L 56.4375 67.988281 L 94.183594 67.988281 L 83.585938 100.554688 L 101.269531 91.804688 L 107.578125 72.273438 L 95.730469 63.582031 Z M 95.851562 63.34375 "
      />
      <path
        fill="#FCFC03"
        d="M 35.304688 86.5625 L 46.199219 52.628906 L 34.113281 43.578125 L 15.957031 100.554688 L 83.585938 100.554688 L 88.113281 86.5625 Z M 35.304688 86.5625 "
      />
    </g>
  </svg>
)
