'use client'

import { Navigation } from '@sushiswap/ui'
import React, { FC } from 'react'

import { headerElements } from '../_common/header-elements'

export const Header: FC = () => {
  return <Navigation leftElements={headerElements} />
}
