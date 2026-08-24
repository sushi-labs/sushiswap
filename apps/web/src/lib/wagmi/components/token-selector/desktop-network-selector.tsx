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
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { useCallback } from 'react'
import { getNetworkName } from 'src/lib/network'
import { useChainIds } from 'src/lib/wallet/hooks/use-chain-ids'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { useTokenSelectorTheme } from './token-selector-theme'

interface DesktopNetworkSelector<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
> {
  networks: readonly TChainId[]
  onSelect: (chainId: TChainId) => void
  selectedNetwork: TChainId
}

export function DesktopNetworkSelector<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
>({ networks, selectedNetwork, onSelect }: DesktopNetworkSelector<TChainId>) {
  const theme = useTokenSelectorTheme()
  const chainIds = useChainIds()

  const _onSelect = useCallback(
    (value: string) => {
      const chainId = Number(value.split('__')[1])
      const network = networks.find((network) => network === chainId)

      if (network) {
        onSelect(network)
      }
    },
    [networks, onSelect],
  )

  return (
    <Command
      className={classNames(
        '!w-56 flex-none rounded-l-2xl rounded-r-none pt-3',
        theme === 'perps'
          ? '!bg-white/[0.025] text-perps-muted'
          : 'bg-white dark:!bg-secondary',
      )}
    >
      <div
        className={classNames(
          'mx-3 rounded-lg',
          theme === 'perps' ? 'bg-white/[0.04]' : 'bg-secondary',
        )}
      >
        <CommandInput
          testdata-id="network-selector-input"
          placeholder="Search network"
        />
      </div>
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
                variant={
                  theme === 'perps'
                    ? selectedNetwork === network
                      ? 'perps-secondary'
                      : 'ghost'
                    : selectedNetwork === network
                      ? 'secondary'
                      : 'ghost'
                }
              >
                <Badge
                  position="bottom-right"
                  badgeContent={
                    <div
                      className={classNames(
                        'rounded-full w-2 h-2 mr-0.5 mb-0.5',
                        chainIds?.includes(network) && 'bg-green',
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
      <CommandEmpty className="p-2 mx-auto">No network found.</CommandEmpty>
    </Command>
  )
}
