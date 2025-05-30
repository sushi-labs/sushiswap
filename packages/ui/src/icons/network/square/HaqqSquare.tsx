import React from 'react'

import { HaqqNaked } from '../naked/HaqqNaked'

import type { IconComponent } from '../../../types'

export const HaqqSquare: IconComponent = (props) => {
  return (
    <HaqqNaked
      {...props}
      circle={
        <rect
          width="128"
          height="128"
          x="0.265"
          fill="currentColor"
          className="fill-black dark:fill-white"
        />
      }
    />
  )
}
