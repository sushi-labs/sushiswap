import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const KavaNaked: NakedNetworkIconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="#FF433E"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.circle}
    <path d="M43.0347 24H29.0693V104H43.0347V24Z" />
    <path d="M81.208 104L50.6184 64L81.208 24H98.7109L68.5375 64L98.7109 104H81.208Z" />
  </svg>
)
