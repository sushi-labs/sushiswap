'use client'

import { usePrevious } from '@sushiswap/hooks'
import {
  InterfaceEventName,
  WalletConnectionResult,
  sendAnalyticsEvent,
} from '@sushiswap/telemetry'
import { Suspense, useEffect } from 'react'
import type { ChainId } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { HeaderNetworkSelector } from './header-network-selector'
import { UserPortfolio } from './user-portfolio'

interface WagmiHeaderComponentsProps {
  networks: readonly ChainId[]
  supportedNetworks?: readonly ChainId[]
  selectedNetwork?: ChainId
  onChange?(chainId: EvmChainId): void
}

export const WagmiHeaderComponents: React.FC<WagmiHeaderComponentsProps> = ({
  networks,
  selectedNetwork,
  supportedNetworks,
  onChange,
}) => {
  const { chainId, address, connector } = useAccount()
  const previousConnectedChainId = usePrevious(chainId)
  useEffect(() => {
    const chainChanged =
      previousConnectedChainId && previousConnectedChainId !== chainId
    if (chainChanged) {
      sendAnalyticsEvent(InterfaceEventName.CHAIN_CHANGED, {
        result: WalletConnectionResult.SUCCEEDED,
        wallet_address: address,
        wallet_type: connector?.name ?? 'Network',
        chain_id: chainId,
        previousConnectedChainId,
        page: window.origin,
      })
    }
  }, [address, chainId, connector, previousConnectedChainId])

  return (
    <Suspense>
      <HeaderNetworkSelector
        networks={networks}
        selectedNetwork={selectedNetwork}
        supportedNetworks={supportedNetworks}
        onChange={onChange}
        className="flex"
      />
      <UserPortfolio />
    </Suspense>
  )
}
