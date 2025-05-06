import React from 'react'

import { CoreNaked } from '../naked/CoreNaked'

import type { IconComponent } from '../../../types'

export const CoreCircle: IconComponent = (props) => {
  return (
    <CoreNaked
      {...props}
      circle={<rect width={128} height={128} rx={64} fill="#121212" />}
    />
  )
}
