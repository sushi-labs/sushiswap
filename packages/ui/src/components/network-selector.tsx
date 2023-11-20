'use client'

import React, { ReactNode, useMemo, useState } from 'react'
import { Chain, ChainId } from 'sushi/chain'

import Link from 'next/link'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command'
import { AptosCircle, NetworkIcon } from './icons'
import { Popover, PopoverContent, PopoverPrimitive } from './popover'

export type NetworkSelectorOnSelectCallback<T extends number = ChainId> = (
  chainId: T,
  close: () => void,
) => void

const PREFERRED_CHAINID_ORDER: ChainId[] = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.SCROLL,
  ChainId.OPTIMISM,
  ChainId.LINEA,
  ChainId.CORE,
  ChainId.FILECOIN,
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

const NEW_CHAINS: number[] = [ChainId.FILECOIN] satisfies ChainId[]

const NetworkSelector = <T extends number>({
  onSelect,
  networks = [],
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [open, setOpen] = useState(false)

  const _networks = useMemo(() => {
    const INCLUDED_PREFERRED_CHAIN_IDS = PREFERRED_CHAINID_ORDER.filter((el) =>
      networks.includes(el as T),
    )
    return Array.from(new Set([...INCLUDED_PREFERRED_CHAIN_IDS, ...networks]))
  }, [networks])

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverContent className="!w-60 !p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command>
          <CommandInput
            testdata-id="network-selector-input"
            placeholder="Search network"
          />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup>
            <CommandItem className="cursor-pointer">
              <Link href="https://aptos.sushi.com">
                <div className="flex items-center gap-2">
                  <AptosCircle width={22} height={22} />
                  Aptos
                  <div className="text-[10px] italic rounded-full px-[6px] bg-gradient-to-r from-blue to-pink text-white font-bold">
                    NEW
                  </div>
                </div>
              </Link>
            </CommandItem>
            {_networks.map((el) => (
              <CommandItem
                className="cursor-pointer"
                testdata-id={`network-selector-${el}`}
                value={`${Chain.from(el)?.name}__${el}`}
                key={el}
                onSelect={(value) =>
                  onSelect(+value.split('__')[1] as T, () => setOpen(false))
                }
              >
                <div className="flex items-center gap-2">
                  <NetworkIcon chainId={el} width={22} height={22} />
                  {NEW_CHAINS.includes(el) ? (
                    <>
                      {Chain.from(el)?.name}
                      <div className="text-[10px] italic rounded-full px-[6px] bg-gradient-to-r from-blue to-pink text-white font-bold">
                        NEW
                      </div>
                    </>
                  ) : (
                    Chain.from(el)?.name
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { NetworkSelector }
