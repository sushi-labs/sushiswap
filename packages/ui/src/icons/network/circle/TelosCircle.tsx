import * as React from 'react'

import { TelosNaked } from '../naked/TelosNaked'

import { IconComponent } from '../../../types'

export const TelosCircle: IconComponent = (props) => (
  <TelosNaked
    {...props}
    className="!text-white"
    circle={<rect width={128} height={128} rx={64} fill="#5613FF" />}
  />
)
