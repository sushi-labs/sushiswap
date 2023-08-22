import React, { FC } from 'react'

import { ComponentsWrapperProps, SushiSwapV2PoolFinderProps, TridentPoolFinderProps } from './types'

export const ComponentsWrapper: FC<ComponentsWrapperProps<SushiSwapV2PoolFinderProps | TridentPoolFinderProps>> = ({
  children,
}) => {
  return <>{children}</>
}
