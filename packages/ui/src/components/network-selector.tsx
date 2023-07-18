'use client'

import { Chain, ChainId } from '@sushiswap/chain'
import React, { ReactNode, useState } from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command'
import { NetworkIcon } from './icons'
import { PopoverContent, PopoverNew, PopoverPrimitive } from './popovernew'

export type NetworkSelectorOnSelectCallback<T extends number = ChainId> = (chainId: T, close: () => void) => void

export interface NetworkSelectorProps<T extends number = ChainId> {
  networks: readonly T[]
  selected: T
  onSelect: NetworkSelectorOnSelectCallback<T>
  children: ReactNode
}

const NetworkSelector = <T extends number>({
  onSelect,
  networks = [],
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [open, setOpen] = useState(false)

  return (
    <PopoverNew modal={true} open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverContent className="!w-60 !p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command>
          <CommandInput placeholder="Search network..." />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup>
            {networks.map((el) => (
              <CommandItem
                testdata-id={`network-selector-${el}`}
                value={`${Chain.from(el).name}__${el}`}
                key={el}
                onSelect={(value) => onSelect(+value.split('__')[1] as T, () => setOpen(false))}
              >
                <div className="flex items-center gap-2">
                  <NetworkIcon chainId={el} width={16} height={16} />
                  {Chain.from(el).name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </PopoverNew>
  )
}

export { NetworkSelector }
