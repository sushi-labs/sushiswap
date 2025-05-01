/*
'use client'

import type { FC } from 'react'
import {
  SidebarContainer as BaseSidebarContainer,
  type SidebarContainerProps,
  SidebarProvider,
} from 'src/ui/sidebar'
import { useAccount } from 'wagmi'

export const SidebarContainer: FC<
  Omit<SidebarContainerProps, 'connectedNetwork'>
> = (props) => {
  const { chainId } = useAccount()

  return <BaseSidebarContainer {...props} connectedNetwork={chainId} />
}

export { SidebarProvider }
*/
