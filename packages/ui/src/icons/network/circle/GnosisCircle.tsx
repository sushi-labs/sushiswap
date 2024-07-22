import * as React from 'react'

import { GnosisNaked } from '../naked/GnosisNaked'

import { IconComponent } from '../../../types'

export const GnosisCircle: IconComponent = (props) => (
  <GnosisNaked
    {...props}
    className="dark:text-gray-700"
    circle={<rect width="128" height="128" fill="#d0e2ef" rx="64" />}
  />
)
