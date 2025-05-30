import * as React from 'react'

import { GnosisNaked } from '../naked/GnosisNaked'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'

export const GnosisSquare: IconComponent = (props) => (
  <GnosisNaked
    {...props}
    className={classNames(props.className, 'text-gray-700')}
    circle={<rect width="128" height="128" fill="#d0e2ef" />}
  />
)
