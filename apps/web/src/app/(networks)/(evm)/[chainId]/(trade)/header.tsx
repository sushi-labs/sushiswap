'use client'

import { ChainId } from 'sushi'
import { Header as _Header } from '~evm/[chainId]/header'

interface HeaderProps {
  chainId?: ChainId
  networks?: readonly ChainId[]
}

export function Header({ chainId, networks }: HeaderProps) {
  return (
    <_Header
      chainId={chainId}
      networks={networks}
      variant={chainId === ChainId.KATANA ? 'transparent' : 'default'}
    />
  )
}
