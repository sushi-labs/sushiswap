import React, { type FC, useMemo } from 'react'

import type { IconProps } from '../types'
import { NETWORK_CIRCLE_ICON, NETWORK_NAKED_ICON } from './network'
import { NETWORK_SQUARE_ICON } from './network/squared'

interface Props extends IconProps {
  type?: 'naked' | 'circle' | 'square'
  chainId: number | string
}

export const NetworkIcon: FC<Props> = ({
  type = 'circle',
  chainId,
  ...props
}) => {
  const Icon = useMemo(() => {
    if (type === 'naked') {
      return NETWORK_NAKED_ICON[chainId]
    }

    if (type === 'square') {
      return NETWORK_SQUARE_ICON[chainId]
    }

    return NETWORK_CIRCLE_ICON[chainId]
  }, [chainId, type])

  if (Icon) return <Icon {...props} />
  return <></>
}
