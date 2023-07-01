import type { ChainId } from '@sushiswap/chain'
import { ReactNode } from 'react'

import { NetworkSelectorDialog } from './NetworkSelectorDialog'
import { NetworkSelectorMenu } from './NetworkSelectorMenu'

export type NetworkSelectorOnSelectCallback<T extends number = ChainId> = (chainId: T, close: () => void) => void

export interface NetworkSelectorProps<T extends number = ChainId> {
  networks: readonly T[]
  selected: T
  onSelect: NetworkSelectorOnSelectCallback<T>
  variant: 'menu' | 'dialog'
  children: ReactNode
}

export const NetworkSelector = <T extends number>({
  networks,
  variant,
  selected,
  onSelect,
  children,
}: NetworkSelectorProps<T>) => {
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
