'use client'

import { ChainId } from '@sushiswap/chain'
import { AppearOnMount } from '@sushiswap/ui'

import { HeaderNetworkSelector } from './HeaderNetworkSelector'
import { UserProfile } from './UserProfile'

interface WagmiHeaderComponentsProps {
  chainIds: ChainId[]
  selectedNetwork?: ChainId
  onChange?(chainId: ChainId): void
}

export const WagmiHeaderComponents: React.FC<WagmiHeaderComponentsProps> = ({
  chainIds,
  selectedNetwork,
  onChange,
}) => {
  return (
    <AppearOnMount className="flex items-center gap-2">
      <HeaderNetworkSelector networks={chainIds} selectedNetwork={selectedNetwork} onChange={onChange} />
      <UserProfile networks={chainIds} />
    </AppearOnMount>
  )
}
