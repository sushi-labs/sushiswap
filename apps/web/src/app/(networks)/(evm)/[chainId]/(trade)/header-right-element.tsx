'use client'

import { SUPPORTED_NETWORKS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import type { ChainId } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { useChainId } from 'wagmi'

export function HeaderRightElement({
  chainId: _chainId,
  supportedNetworks,
}: { chainId: EvmChainId; supportedNetworks?: readonly ChainId[] }) {
  const connectedChainId = useChainId()
  const chainId = _chainId ?? connectedChainId

  return (
    <WagmiHeaderComponents
      networks={SUPPORTED_NETWORKS}
      selectedNetwork={chainId}
      supportedNetworks={supportedNetworks}
    />
  )
}
