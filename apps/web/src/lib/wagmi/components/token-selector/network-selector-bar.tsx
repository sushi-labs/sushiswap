'use client'

import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
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
import { type ReactElement, useLayoutEffect, useRef, useState } from 'react'
import { getNetworkName } from 'src/lib/network'
import type { TokenSelectorChainId } from './config'

const NETWORK_BUTTON_WIDTH = 52.5
const NETWORK_GAP = 8

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
  const [visibleCount, setVisibleCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const hasOverflow = networks.length > visibleCount

  useLayoutEffect(() => {
    const container = containerRef.current
    const moreButton = moreButtonRef.current
    if (!container || !moreButton) return

    function updateVisibleCount(): void {
      if (!container || !moreButton) return

      // Layout widths stay accurate while the dialog's opening animation scales it.
      const width = Number.parseFloat(getComputedStyle(container).width)
      const moreWidth = Number.parseFloat(getComputedStyle(moreButton).width)
      const allNetworksWidth =
        networks.length * (NETWORK_BUTTON_WIDTH + NETWORK_GAP) - NETWORK_GAP

      if (allNetworksWidth <= width) {
        setVisibleCount(networks.length)
        setOpen(false)
      } else {
        setVisibleCount(
          Math.max(
            0,
            Math.floor(
              (width - moreWidth) / (NETWORK_BUTTON_WIDTH + NETWORK_GAP),
            ),
          ),
        )
      }
    }

    updateVisibleCount()
    const observer = new ResizeObserver(updateVisibleCount)
    observer.observe(container)
    observer.observe(moreButton)
    return () => observer.disconnect()
  }, [networks.length])

  const visibleNetworks = networks.slice(0, visibleCount)

  if (
    visibleNetworks.length > 0 &&
    networks.includes(selectedNetwork) &&
    !visibleNetworks.includes(selectedNetwork)
  ) {
    visibleNetworks[visibleNetworks.length - 1] = selectedNetwork
  }

  return (
    <div
      ref={containerRef}
      className="relative flex w-full min-w-0 shrink-0 items-center py-2"
      style={{ gap: NETWORK_GAP }}
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
          style={{ width: NETWORK_BUTTON_WIDTH }}
          className={classNames(
            '!h-12 shrink-0 !p-2 rounded-lg border',
            selectedNetwork === network ? 'border-pink' : 'border-accent',
          )}
          onClick={() => onSelect(network)}
        >
          <NetworkIcon chainId={network} width={28} height={28} />
        </Button>
      ))}
      {/* Keep the trigger measurable when all networks fit. */}
      <Popover open={hasOverflow && open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            ref={moreButtonRef}
            type="button"
            variant="ghost"
            aria-label="More networks"
            className={classNames(
              '!h-12 shrink-0 gap-2 !px-4 rounded-lg border border-accent font-normal',
              !hasOverflow && 'invisible absolute',
            )}
          >
            <span className="hidden sm:block">More</span>
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
                      <CheckIcon width={16} height={16} aria-label="Selected" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
