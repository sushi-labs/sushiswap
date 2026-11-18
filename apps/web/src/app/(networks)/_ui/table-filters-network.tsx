'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
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
import { CheckIcon } from '@sushiswap/ui/icons/check-icon'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { usePathname, useRouter } from 'next/navigation'
import React, { type FC, useCallback, useState } from 'react'
import { SUPPORTED_NETWORKS } from 'src/config'
import { getNetworkName, replaceNetworkSlug } from 'src/lib/network'
import { type ChainId, isChainId } from 'sushi'

export const TableFiltersNetwork: FC<{
  network: ChainId
  supportedNetworks?: readonly ChainId[]
  unsupportedNetworkHref?: string
  onSelect?: ((network: ChainId) => void) | null
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
      const chainId = +value.split('__')[1]

      if (!isChainId(chainId)) return
      if (_onSelect === null) return
      if (typeof _onSelect === 'function') return _onSelect(chainId)

      push(replaceNetworkSlug(chainId, pathname), { scroll: false })
    },
    [pathname, push, _onSelect],
  )

  const isSupportedNetwork = useCallback(
    (network: ChainId) => supportedNetworks.includes(network),
    [supportedNetworks],
  )

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          icon={ChevronDownIcon}
          variant="secondary"
          role="combobox"
          size="sm"
          aria-expanded={open}
          iconPosition="end"
          className={classNames(className, '!text-muted-foreground')}
        >
          <span>Network</span>
          <NetworkIcon type="circle" chainId={network} width={14} height={14} />
          <span>{getNetworkName(network)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll !bg-background"
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
                    'py-2 pl-8 pr-2 cursor-pointer hover:bg-muted',
                    !isSupported ? 'opacity-30' : null,
                  )}
                >
                  {network === _network ? (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <CheckIcon
                        strokeWidth={3}
                        width={16}
                        height={16}
                        className="text-pink"
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
