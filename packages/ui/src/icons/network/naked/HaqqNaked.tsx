import React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'

export const HaqqNaked: NakedNetworkIconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      fill="none"
      viewBox="0 0 128 128"
      {...props}
    >
      {props.circle}
      <g clipPath="url(#clip0_1006_159)">
        <mask
          id="mask0_1006_159"
          style={{ maskType: 'luminance' }}
          width="80"
          height="80"
          x="24"
          y="24"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M104 24H24v80h80V24z" />
        </mask>
        <g mask="url(#mask0_1006_159)">
          <mask
            id="mask1_1006_159"
            style={{ maskType: 'alpha' }}
            width="80"
            height="80"
            x="24"
            y="24"
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="#D9D9D9"
              d="M64 24l12.246 10.436 16.038 1.28 1.28 16.038L104 64 93.564 76.246l-1.28 16.038-16.038 1.28L64 104 51.754 93.564l-16.038-1.28-1.28-16.038L24 64l10.436-12.246 1.28-16.038 16.038-1.28L64 24z"
            />
          </mask>
          <g mask="url(#mask1_1006_159)">
            <path
              fill="currentColor"
              className="fill-white dark:fill-black"
              d="M108.381 13.037H20.709v103.014h87.672V13.037z"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1006_159">
          <path fill="#fff" d="M0 0H80V80H0z" transform="translate(24 24)" />
        </clipPath>
      </defs>
    </svg>
  )
}
