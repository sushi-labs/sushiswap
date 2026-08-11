'use client'

import { HeaderShell } from 'src/app/(networks)/_ui/header-shell'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import type { ChainId } from 'sushi'
import { useChainId } from 'wagmi'

interface HeaderProps {
  chainId?: ChainId
  networks?: readonly ChainId[]
  variant?: 'default' | 'transparent'
}

export function Header({ chainId: _chainId, networks, variant }: HeaderProps) {
  const connectedChainId = useChainId()
  const chainId = _chainId ?? connectedChainId

  return (
    <HeaderShell
      chainId={chainId}
      variant={variant}
      rightElement={
        <WagmiHeaderComponents networks={networks} selectedNetwork={chainId} />
      }
    />
  )
}
