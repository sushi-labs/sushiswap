import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const ZKSyncNaked: NakedNetworkIconComponent = (props) => (
  <svg
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="dark:text-white text-black"
    {...props}
  >
    {props.circle}
    <path
      d="M101.385 63.68L80.0409 42.432V57.984L58.8569 73.568H80.0409V84.928L101.385 63.68Z"
      fill="currentColor"
    />
    <path
      d="M26.1851 63.68L47.5291 84.928V69.472L68.7131 53.76H47.5291V42.4L26.1851 63.68Z"
      fill="currentColor"
    />
  </svg>
)
