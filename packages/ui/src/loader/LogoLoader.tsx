import React, { FC } from 'react'

import { SushiIcon } from '../icons'
import { LoaderProps } from './types'

/**
 * @deprecated
 */
export const LogoLoader: FC<LoaderProps> = (props) => {
  return <SushiIcon className="animate-heartbeat" {...props} />
}
