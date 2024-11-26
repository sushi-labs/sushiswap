import React from 'react'

import { HaqqNaked } from '../naked/HaqqNaked'

import { IconComponent } from '../../../types'

export const HaqqCircle: IconComponent = (props) => {
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
          rx="64"
        />
      }
    />
  )
}
