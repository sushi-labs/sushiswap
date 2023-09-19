import React, { FC } from 'react'

import { ComponentsWrapperProps, SushiSwapV2PoolFinderProps, TridentPoolFinderProps } from './types.js'

export const ComponentsWrapper: FC<ComponentsWrapperProps<SushiSwapV2PoolFinderProps | TridentPoolFinderProps>> = ({
  children,
}) => {
  return <>{children}</>
}
