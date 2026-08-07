import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const FantomNaked: NakedNetworkIconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="#13B5EC"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.circle}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m68.8 51.739 14.4-8.442V60.18l-14.4-8.442Zm14.4 36.18L64 99.177 44.8 87.92V68.22L64 79.477l19.2-11.256V87.92ZM44.8 43.298l14.4 8.442-14.4 8.442V43.297Zm21.6 12.462L80.8 64.2l-14.4 8.442V55.76Zm-4.8 16.884-14.4-8.442 14.4-8.442v16.884Zm19.2-33.367L64 48.925l-16.8-9.649L64 29.226l16.8 10.05ZM40 37.668v52.664L64 104l24-13.668V37.668L64 24 40 37.668Z"
    />
  </svg>
)
