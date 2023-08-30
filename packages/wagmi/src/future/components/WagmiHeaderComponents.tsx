'use client'

import { ChainId } from '@sushiswap/chain'

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
    <>
      <HeaderNetworkSelector networks={chainIds} selectedNetwork={selectedNetwork} onChange={onChange} />
      <UserProfile networks={chainIds} />
    </>
  )
}
