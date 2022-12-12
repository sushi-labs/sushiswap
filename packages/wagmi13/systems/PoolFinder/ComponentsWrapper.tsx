import React, { FC } from 'react'

import { ComponentsWrapperProps, LegacyPoolFinderProps, TridentPoolFinderProps } from './types'

export const ComponentsWrapper: FC<ComponentsWrapperProps<LegacyPoolFinderProps | TridentPoolFinderProps>> = ({
  children,
}) => {
  return <>{children}</>
}
