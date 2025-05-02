'use client'

import { Navigation } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { SUPPORTED_NETWORKS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import { useChainId } from 'wagmi'
import { headerElements } from '../../_common/header-elements'

export const Header: FC = () => {
  const chainId = useChainId()
  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">
        <Navigation
          leftElements={headerElements({ chainId })}
          rightElement={<WagmiHeaderComponents networks={SUPPORTED_NETWORKS} />}
        />
      </div>
    </div>
  )
}
