'use client'

import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { FC, useCallback } from 'react'
import { getNetworkName } from 'src/lib/network'
import { ChainId } from 'sushi/chain'
import { useAccount } from 'wagmi'

interface DesktopNetworkSelector {
  networks: readonly ChainId[]
  onSelect: (chainId: number) => void
  selectedNetwork: ChainId
}

export const DesktopNetworkSelector: FC<DesktopNetworkSelector> = ({
  networks,
  selectedNetwork,
  onSelect,
}) => {
  const { chainId } = useAccount()

  const _onSelect = useCallback(
    (value: string) => onSelect(+value.split('__')[1]),
    [onSelect],
  )

  return (
    <Command className="!w-56 flex-none pt-3 bg-white dark:!bg-secondary rounded-r-none rounded-l-2xl">
      <div className="mx-3 bg-secondary rounded-lg">
        <CommandInput
          testdata-id="network-selector-input"
          placeholder="Search network"
        />
      </div>
      <CommandEmpty className="p-2 mx-auto">No network found.</CommandEmpty>
      <CommandGroup className="overflow-y-auto px-3 pb-3">
        {networks.map((network) => {
          const name = getNetworkName(network)

          return (
            <CommandItem
              key={network}
              className="cursor-pointer aria-selected:!bg-[unset] aria-selected:!text-[unset] !p-0 my-0.5"
              testdata-id={`network-selector-${network}`}
              value={`${name}__${network}`}
              onSelect={_onSelect}
            >
              <Button
                className={'flex items-center !justify-normal gap-2'}
                fullWidth
                variant={selectedNetwork === network ? 'secondary' : 'ghost'}
              >
                <Badge
                  position="bottom-right"
                  badgeContent={
                    <div
                      className={classNames(
                        'rounded-full w-2 h-2 mr-0.5 mb-0.5',
                        chainId === network && 'bg-green',
                      )}
                    />
                  }
                >
                  <NetworkIcon chainId={network} width={22} height={22} />
                </Badge>
                {name}
              </Button>
            </CommandItem>
          )
        })}
      </CommandGroup>
    </Command>
  )
}
