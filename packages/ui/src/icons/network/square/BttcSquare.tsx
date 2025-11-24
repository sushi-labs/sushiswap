import * as React from 'react'

import { BttcNaked } from '../naked/BttcNaked'

import type { IconComponent } from '../../../types'

export const BttcSquare: IconComponent = (props) => {
  return (
    <BttcNaked
      circle={
        <rect
          width="128"
          height="128"
          fill="currentColor"
          className="!text-white dark:!text-gray-700"
        />
      }
      {...props}
    />
  )
}
