'use client'

import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { type ReactElement, useState } from 'react'
import { getNetworkName } from 'src/lib/network'
import type { TokenSelectorChainId } from './config'

interface NetworkSelectorBarProps<TChainId extends TokenSelectorChainId> {
  networks: readonly TChainId[]
  selectedNetwork: TChainId
  onSelect: (chainId: TChainId) => void
}

export function NetworkSelectorBar<TChainId extends TokenSelectorChainId>({
  networks,
  selectedNetwork,
  onSelect,
}: NetworkSelectorBarProps<TChainId>): ReactElement {
  const [open, setOpen] = useState(false)
  const { isMd } = useBreakpoint('md')
  const visibleCount = isMd ? 7 : 4
  const visibleNetworks = networks.slice(0, visibleCount)

  if (
    networks.includes(selectedNetwork) &&
    !visibleNetworks.includes(selectedNetwork)
  ) {
    visibleNetworks[visibleNetworks.length - 1] = selectedNetwork
  }

  return (
    <div
      className="flex shrink-0 items-center gap-2 py-2"
      aria-label="Networks"
    >
      {visibleNetworks.map((network) => (
        <Button
          key={network}
          type="button"
          variant="ghost"
          aria-label={getNetworkName(network)}
          aria-pressed={selectedNetwork === network}
          title={getNetworkName(network)}
          testdata-id={`network-selector-${network}`}
          className={classNames(
            '!h-12 !w-[52.5px] shrink-0 !p-2  rounded-lg border',
            selectedNetwork === network ? 'border-pink' : 'border-accent',
          )}
          onClick={() => onSelect(network)}
        >
          <NetworkIcon chainId={network} width={28} height={28} />
        </Button>
      ))}
      {networks.length > visibleCount ? (
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="More networks"
              className="!h-12 shrink-0 gap-2 !px-4 rounded-lg border border-accent font-normal"
            >
              More
              <ChevronDownIcon width={16} height={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="!p-0 !w-64">
            <Command>
              <CommandInput
                aria-label="Search networks"
                testdata-id="network-selector-input"
                placeholder="Search network"
              />
              <CommandList className="scroll">
                <CommandEmpty>No network found.</CommandEmpty>
                <CommandGroup>
                  {networks.map((network) => (
                    <CommandItem
                      key={network}
                      value={`${getNetworkName(network)}__${network}`}
                      testdata-id={`network-selector-more-${network}`}
                      className="cursor-pointer gap-2"
                      onSelect={() => {
                        onSelect(network)
                        setOpen(false)
                      }}
                    >
                      <NetworkIcon chainId={network} width={24} height={24} />
                      <span className="flex-1">{getNetworkName(network)}</span>
                      {selectedNetwork === network ? (
                        <CheckIcon
                          width={16}
                          height={16}
                          aria-label="Selected"
                        />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}
