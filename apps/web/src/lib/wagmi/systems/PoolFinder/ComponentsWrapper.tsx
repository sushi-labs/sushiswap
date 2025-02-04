import React, { type FC } from 'react'

import type {
  ComponentsWrapperProps,
  SushiSwapV2PoolFinderProps,
} from './types'

export const ComponentsWrapper: FC<
  ComponentsWrapperProps<SushiSwapV2PoolFinderProps>
> = ({ children }) => {
  return <>{children}</>
}
