import * as React from 'react'

import { TelosNaked } from '../naked/TelosNaked'

import classNames from 'classnames'
import type { IconComponent } from '../../../types'

export const TelosSquare: IconComponent = (props) => (
  <TelosNaked
    {...props}
    className={classNames(props.className, '!text-white')}
    circle={<rect width={128} height={128} fill="#5613FF" />}
  />
)
