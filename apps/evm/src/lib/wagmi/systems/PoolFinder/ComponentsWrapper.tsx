import React, { FC } from 'react'

import { ComponentsWrapperProps, SushiSwapV2PoolFinderProps } from './types'

export const ComponentsWrapper: FC<
  ComponentsWrapperProps<SushiSwapV2PoolFinderProps>
> = ({ children }) => {
  return <>{children}</>
}
