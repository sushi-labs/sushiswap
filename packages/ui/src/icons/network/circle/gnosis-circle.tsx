import * as React from 'react'

import { GnosisNaked } from '../naked/gnosis-naked'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'

export const GnosisCircle: IconComponent = (props) => (
  <GnosisNaked
    {...props}
    className={classNames(props.className, 'text-gray-700')}
    circle={<rect width="128" height="128" fill="#d0e2ef" rx="64" />}
  />
)
