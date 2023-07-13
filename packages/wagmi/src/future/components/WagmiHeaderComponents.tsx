'use client'

import { ChainId } from '@sushiswap/chain'
import dynamic from 'next/dynamic'

import { HeaderNetworkSelector } from './HeaderNetworkSelector'
import { UserProfile } from './UserProfile'

interface WagmiHeaderComponentsProps {
  chainIds: ChainId[]
  selectedNetwork?: ChainId
  onChange?(chainId: ChainId): void
}

const Component: React.FC<WagmiHeaderComponentsProps> = ({ chainIds, selectedNetwork, onChange }) => {
  return (
    <>
      <HeaderNetworkSelector networks={chainIds} selectedNetwork={selectedNetwork} onChange={onChange} />
      <UserProfile networks={chainIds} />
    </>
  )
}

export const WagmiHeaderComponents = dynamic(() => Promise.resolve(Component), { ssr: false })
