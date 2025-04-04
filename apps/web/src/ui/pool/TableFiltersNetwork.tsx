'use client'

import { PlusCircleIcon } from '@heroicons/react/24/outline'
import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@sushiswap/ui'
import { CheckIcon } from '@sushiswap/ui/icons/CheckIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { usePathname, useRouter } from 'next/navigation'
import React, { type FC, useCallback, useState } from 'react'
import { type NonStandardChainId, SUPPORTED_NETWORKS } from 'src/config'
import { getNetworkName, replaceNetworkSlug } from 'src/lib/network'
import { type ChainId, isChainId } from 'sushi/chain'

export const TableFiltersNetwork: FC<{
  network: ChainId | NonStandardChainId
  supportedNetworks?: readonly (ChainId | NonStandardChainId)[]
  unsupportedNetworkHref?: string
  onSelect?: ((network: ChainId | NonStandardChainId) => void) | null
  className?: string
}> = ({
  network,
  supportedNetworks = SUPPORTED_NETWORKS,
  unsupportedNetworkHref,
  onSelect: _onSelect,
  className,
}) => {
  const [open, setOpen] = useState(false)

  const { push } = useRouter()
  const pathname = usePathname()

  const onSelect = useCallback(
    (value: string) => {
      const _network = value.split('__')[1]

      const network = isChainId(+_network)
        ? (+_network as ChainId)
        : (_network as NonStandardChainId)

      if (_onSelect === null) return
      if (typeof _onSelect === 'function') return _onSelect(network)

      push(replaceNetworkSlug(network, pathname), { scroll: false })
    },
    [pathname, push, _onSelect],
  )

  const isSupportedNetwork = useCallback(
    (network: ChainId | NonStandardChainId) =>
      supportedNetworks.includes(network),
    [supportedNetworks],
  )

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          icon={PlusCircleIcon}
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className={classNames(className, '!border-dashed')}
        >
          <span>Network</span>
          <Chip variant="secondary">{getNetworkName(network)}</Chip>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll"
      >
        <Command className="flex items-center gap-1">
          <CommandInput
            testdata-id="network-selector-input"
            placeholder="Search network"
          />
          <CommandGroup>
            {SUPPORTED_NETWORKS.map((_network) => {
              const name = getNetworkName(_network)
              const isSupported = isSupportedNetwork(_network)

              return (
                <CommandItem
                  key={_network}
                  value={`${name}__${_network}`}
                  onSelect={
                    isSupported
                      ? onSelect
                      : unsupportedNetworkHref
                        ? () => push(unsupportedNetworkHref)
                        : undefined
                  }
                  className={classNames(
                    'py-2 pl-8 pr-2',
                    !isSupported ? 'opacity-30' : null,
                  )}
                >
                  {network === _network ? (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon
                        strokeWidth={3}
                        width={16}
                        height={16}
                        className="text-blue"
                      />
                    </span>
                  ) : null}
                  <NetworkIcon
                    type="circle"
                    chainId={_network}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {name}
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
