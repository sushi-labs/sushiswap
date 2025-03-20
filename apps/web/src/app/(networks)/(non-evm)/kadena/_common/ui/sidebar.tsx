'use client'

import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react'
import type { FC } from 'react'
import { NonStandardChainId } from 'src/config'
import {
  SidebarContainer as BaseSidebarContainer,
  type SidebarContainerProps,
  SidebarProvider,
} from 'src/ui/sidebar'

export const SidebarContainer: FC<
  Omit<SidebarContainerProps, 'connectedNetwork' | 'selectedNetwork'>
> = (props) => {
  const { network } = useAptosWallet()

  return (
    <BaseSidebarContainer
      {...props}
      selectedNetwork={NonStandardChainId.KADENA}
      connectedNetwork={
        network?.name === 'mainnet' ? NonStandardChainId.KADENA : undefined
      }
    />
  )
}

export { SidebarProvider }
