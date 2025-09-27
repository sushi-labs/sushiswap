import type { ChainId } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { isMvmChainId } from 'sushi/mvm'
import { isTvmChainId } from 'sushi/tvm'
import { HeaderRightElement as MvmHeaderRightElement } from '~aptos/header-right-element'
import { HeaderRightElement as EvmHeaderRightElement } from '~evm/[chainId]/(trade)/header-right-element'
import { HeaderRightElement as TvmHeaderRightElement } from '~tron/header-right-element'
import { HeaderClient } from './header-client'

interface HeaderProps {
  chainId: ChainId
  supportedNetworks?: readonly ChainId[]
  theme?: 'default' | 'transparent'
}

function RightElement({ chainId, supportedNetworks }: HeaderProps) {
  if (!chainId) return null

  if (isEvmChainId(chainId)) {
    return (
      <EvmHeaderRightElement
        chainId={chainId}
        supportedNetworks={supportedNetworks}
      />
    )
  }

  if (isTvmChainId(chainId)) {
    return <TvmHeaderRightElement supportedNetworks={supportedNetworks} />
  }

  if (isMvmChainId(chainId)) {
    return <MvmHeaderRightElement supportedNetworks={supportedNetworks} />
  }

  return null
}

export function Header(props: HeaderProps) {
  return <HeaderClient rightElement={<RightElement {...props} />} {...props} />
}
