'use client'

import { ChainId } from '@sushiswap/chain'
import { FC, ReactNode } from 'react'

import { NetworkSelectorDialog } from './NetworkSelectorDialog'
import { NetworkSelectorMenu } from './NetworkSelectorMenu'

export interface NetworkSelectorProps {
  networks: ChainId[]
  selected: ChainId
  onSelect(chainId: ChainId): void
  variant: 'menu' | 'dialog'
  children(props: { selected: ChainId; setOpen(open: boolean): void }): ReactNode
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
