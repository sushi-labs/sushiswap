import { supportedChains } from '@orbs-network/twap-ui-sushiswap'
import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { NetworkSelector } from 'src/lib/wagmi/components/network-selector'
import type { EvmChainId } from 'sushi/chain'
import { useChainId } from 'wagmi'
import { useSwitchChain } from 'wagmi'

export const TwapNetworkSelector = ({ children }: { children: ReactNode }) => {
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const onSelect = useCallback(
    (chainId: EvmChainId) => {
      switchChain({ chainId: chainId })
    },
    [switchChain],
  )

  return (
    <NetworkSelector
      selected={chainId}
      networks={supportedChains as EvmChainId[]}
      onSelect={onSelect}
    >
      {children}
    </NetworkSelector>
  )
}
