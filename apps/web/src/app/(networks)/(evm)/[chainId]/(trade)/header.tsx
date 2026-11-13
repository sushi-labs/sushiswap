'use client'

import type { ReactElement } from 'react'
import { useSwapPageChainId } from 'src/app/(networks)/_ui/use-swap-page-chain-id'
import { ChainId } from 'sushi'
import { Header as _Header } from '~evm/[chainId]/header'

interface HeaderProps {
  chainId?: ChainId
  networks?: readonly ChainId[]
}

export function Header({
  chainId: defaultChainId,
  networks,
}: HeaderProps): ReactElement {
  const chainId = useSwapPageChainId() ?? defaultChainId
  return (
    <_Header
      chainId={chainId}
      networks={networks}
      variant={chainId === ChainId.KATANA ? 'transparent' : 'default'}
    />
  )
}
