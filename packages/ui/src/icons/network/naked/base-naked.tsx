import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const BaseNaked: NakedNetworkIconComponent = (props) => (
  <svg
    width="128"
    height="128"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.circle}
    <path
      d="M63.9184 110.385C89.5824 110.385 110.385 89.6196 110.385 64.0001C110.385 38.3805 89.5824 17.6147 63.9184 17.6147C39.5716 17.6147 19.6 36.3099 17.6147 60.1H79.0326V67.9001H17.6147C19.6 91.6902 39.5716 110.385 63.9184 110.385Z"
      fill="white"
    />
  </svg>
)
