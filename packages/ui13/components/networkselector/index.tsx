import { ChainId } from '@sushiswap/chain'
import { FC, ReactNode } from 'react'

import { NetworkSelectorDialog } from './NetworkSelectorDialog'
import { NetworkSelectorMenu } from './NetworkSelectorMenu'

export type NetworkSelectorOnSelectCallback = (chainId: ChainId, close: () => void) => void

export interface NetworkSelectorProps {
  networks: ChainId[]
  selected: ChainId
  onSelect: NetworkSelectorOnSelectCallback
  variant: 'menu' | 'dialog'
  children: ((props: { open: boolean; close(): void }) => ReactNode) | ReactNode
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ networks, variant, selected, onSelect, children }) => {
  if (variant === 'dialog') {
    return (
      <NetworkSelectorDialog selected={selected} networks={networks} onSelect={onSelect}>
        {children}
      </NetworkSelectorDialog>
    )
  }

  return (
    <NetworkSelectorMenu networks={networks} selected={selected} onSelect={onSelect}>
      {children}
    </NetworkSelectorMenu>
  )
}
