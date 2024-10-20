import * as React from 'react'

import { NakedNetworkIconComponent } from '../../../types'

export const ApeNaked: NakedNetworkIconComponent = ({ circle, ...props }) => (
  <svg
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {circle}
    <path
      fill-rule="evenodd"
      d="M10.075 9.242H8.001L6.663 20.365h1.669l.195-2.42h.932l.195 2.42h1.76zm-1.428 7.23.18-2.285.136-1.924h.045l.135 1.924.196 2.285zm4.663 3.893h1.79v-4.193h.556c1.278 0 2.06-.752 2.06-2.09v-2.735c0-1.353-.782-2.105-2.06-2.105H13.31zm2.195-5.531h-.391V10.58h.39c.302 0 .422.27.422.767v2.735c0 .481-.12.752-.421.752m4.27-5.592v11.123h3.487v-1.473h-1.698V15.48h1.518v-1.473h-1.518v-3.292h1.698V9.242z"
      fill="#0054FA"
    />
  </svg>
)
