'use client'

import { ChainId } from 'sushi/chain'

import { HeaderNetworkSelector } from './header-network-selector'
import { UserProfile } from './user-profile'

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
      <HeaderNetworkSelector
        networks={chainIds}
        selectedNetwork={selectedNetwork}
        onChange={onChange}
        showAptos={true}
      />
      <UserProfile networks={chainIds} />
    </>
  )
}
