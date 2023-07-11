'use client'

import { Navigation } from '@sushiswap/ui'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/future/components/WagmiHeaderComponents'
import React, { FC } from 'react'
import { Search } from 'ui/swap/search/SearchProvider'
import { useTokenState } from 'ui/swap/token/TokenProvider'
import { useSwapActions } from 'ui/swap/trade/TradeProvider'

import { SUPPORTED_CHAIN_IDS } from '../../config'

export const Header: FC = () => {
  const { setNetworks } = useSwapActions()
  const { fromChainId } = useTokenState()

  return (
    <Search>
      <Navigation
        rightElement={
          <div className="flex gap-2">
            <Search.Button />
            <WagmiHeaderComponents
              chainIds={SUPPORTED_CHAIN_IDS}
              onChange={setNetworks}
              selectedNetwork={fromChainId}
            />
          </div>
        }
      />
      <Search.Panel />
    </Search>
  )
}
