import React from 'react'

import { CoreNaked } from '../naked/CoreNaked'

import type { IconComponent } from '../../../types'

export const CoreSquare: IconComponent = (props) => {
  return (
    <CoreNaked
      {...props}
      circle={<rect width={128} height={128} fill="#121212" />}
    />
  )
}
