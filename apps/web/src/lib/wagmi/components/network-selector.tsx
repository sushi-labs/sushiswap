'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverPrimitive,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { usePathname, useRouter } from 'next/navigation'
import React, { type ReactNode, useCallback, useMemo, useState } from 'react'
import { NEW_CHAIN_IDS } from 'src/config'
import { getNetworkName, replaceNetworkSlug } from 'src/lib/network'
import { type ChainId, getChainById, isChainKey } from 'sushi'
import { isEvmChainId } from 'sushi/evm'

export type NetworkSelectorOnSelectCallback<T extends ChainId = ChainId> = (
  chainId: T,
  close: () => void,
) => void

export interface NetworkSelectorProps<T extends ChainId = ChainId> {
  networks: readonly T[]
  supportedNetworks?: readonly T[]
  selected: T
  onSelect: NetworkSelectorOnSelectCallback<T>
  children: ReactNode
}

const NetworkSelector = <T extends ChainId = ChainId>({
  onSelect,
  networks = [],
  supportedNetworks = networks,
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [open, setOpen] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()
  const supportedNetworksSet = useMemo(
    () => new Set(supportedNetworks),
    [supportedNetworks],
  )

  const _onSelect = useCallback(
    (chainId: T, close: () => void) => {
      const pathSegments = pathname.split('/')

      if (isChainKey(pathSegments[1]) || isEvmChainId(+pathSegments[1])) {
        push(replaceNetworkSlug(chainId, pathname), {
          scroll: false,
        })
      } else if (!isEvmChainId(chainId)) {
        push(`/${getChainById(chainId).key}/swap`, { scroll: false })
      }

      onSelect(chainId, close)
    },
    [push, pathname, onSelect],
  )

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverContent className="!w-60 !p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command>
          <CommandInput
            testdata-id="network-selector-input"
            placeholder="Search network"
          />
          <CommandGroup className="!pr-0">
            {networks.map((network) => {
              const isSupported = supportedNetworksSet.has(network)
              const name = getNetworkName(network)

              return (
                <CommandItem
                  className={classNames('transition-colors duration-100', {
                    'cursor-pointer hover:bg-secondary': isSupported,
                    'opacity-50': !isSupported,
                  })}
                  testdata-id={`network-selector-${network}`}
                  value={`${name}__${network}`}
                  key={network}
                  disabled={!isSupported}
                  onSelect={(value) => {
                    const network = Number.parseInt(value.split('__')[1])
                    _onSelect(network as T, () => setOpen(false))
                  }}
                >
                  <div className="flex items-center gap-2">
                    <NetworkIcon chainId={network} width={22} height={22} />
                    {name}
                    {NEW_CHAIN_IDS.includes(
                      network as (typeof NEW_CHAIN_IDS)[number],
                    ) ? (
                      <div className="text-[10px] italic rounded-full px-[6px] bg-gradient-to-r from-blue to-pink text-white font-bold">
                        NEW
                      </div>
                    ) : null}
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
          <CommandEmpty>No network found.</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { NetworkSelector }
