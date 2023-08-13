'use client'

import { Chain, ChainId } from '@sushiswap/chain'
import React, { ReactNode, useMemo, useState } from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command'
import { NetworkIcon } from './icons'
import { PopoverContent, PopoverNew, PopoverPrimitive } from './popovernew'

export type NetworkSelectorOnSelectCallback<T extends number = ChainId> = (chainId: T, close: () => void) => void

const PREFERRED_CHAINID_ORDER: ChainId[] = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.POLYGON,
  ChainId.OPTIMISM,
  ChainId.BSC,
  ChainId.THUNDERCORE,
  ChainId.GNOSIS,
  ChainId.AVALANCHE,
  ChainId.FANTOM,
  ChainId.ARBITRUM_NOVA,
  ChainId.HARMONY,
]

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

  const _networks = useMemo(() => {
    const INCLUDED_PREFERRED_CHAIN_IDS = PREFERRED_CHAINID_ORDER.filter((el) => networks.includes(el as T))
    return Array.from(new Set([...INCLUDED_PREFERRED_CHAIN_IDS, ...networks]))
  }, [networks])

  return (
    <PopoverNew modal={true} open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverContent className="!w-60 !p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command>
          <CommandInput placeholder="Search network" />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup>
            {_networks.map((el) => (
              <CommandItem
                testdata-id={`network-selector-${el}`}
                value={`${Chain.from(el).name}__${el}`}
                key={el}
                onSelect={(value) => onSelect(+value.split('__')[1] as T, () => setOpen(false))}
              >
                <div className="flex items-center gap-2">
                  <NetworkIcon chainId={el} width={22} height={22} />
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
