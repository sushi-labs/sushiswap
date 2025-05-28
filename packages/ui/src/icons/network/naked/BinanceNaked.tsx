import * as React from 'react'
import type { NakedNetworkIconComponent } from '../../../types'

export const BinanceNaked: NakedNetworkIconComponent = ({
  fill,
  circle,
  ...rest
}) => (
  <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" {...rest}>
    {circle}
    <path
      d="M42.0625 64L33.0625 73.0625L24 64L33.0625 54.9375L42.0625 64ZM64 42.0625L79.5 57.5625L88.5625 48.5L73.0625 33.0625L64 24L54.9375 33.0625L39.5 48.5L48.5625 57.5625L64 42.0625ZM94.9375 54.9375L85.9375 64L95 73.0625L104 64L94.9375 54.9375ZM64 85.9375L48.5 70.4375L39.5 79.5L55 95L64 104L73.0625 94.9375L88.5625 79.4375L79.5 70.4375L64 85.9375ZM64 73.0625L73.0625 64L64 54.9375L54.9375 64L64 73.0625Z"
      fill={fill ?? '#F0B90B'}
    />
  </svg>
)
