'use client'

import { XIcon } from '@heroicons/react-v1/solid'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui'
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
import { getNetworkName } from 'src/lib/network'
import type { ChainId } from 'sushi/chain'
import { PopoverDrawer } from '../common/popover-drawer'
import {
  DEFAULT_POOL_NETWORKS,
  usePoolFilters,
  useSetPoolFilters,
} from './PoolsFiltersProvider'

export const TableFiltersNetworkV2 = () => {
  const { networks } = usePoolFilters()
  const setFilters = useSetPoolFilters()
  const allSelected = networks?.length === DEFAULT_POOL_NETWORKS.length

  const onSelect = (value: string) => {
    const _network = value.split('__')[1]
    const network = +_network as ChainId

    setFilters((prev) => {
      const newNetworks = prev?.networks?.includes(network)
        ? prev.networks.filter((n) => n !== network)
        : [...(prev?.networks ?? []), network]

      return { ...prev, networks: newNetworks }
    })
  }

  const clearAll = () => {
    setFilters((prev) => ({ ...prev, networks: [DEFAULT_POOL_NETWORKS[0]] }))
  }

  const clearSelections = () => {
    setFilters((prev) => ({ ...prev, networks: DEFAULT_POOL_NETWORKS }))
  }

  return (
    <PopoverDrawer
      popoverContentClassName="max-w-[225px] !p-0"
      dialogContentClassName="max-w-none"
      dialogTitle="Network Filter"
      trigger={
        <Button
          icon={PlusCircleIcon}
          variant="outline"
          role="combobox"
          size="sm"
          className={classNames(
            'border-dashed !bg-slate-200 dark:!bg-slate-750',
            'hover:dark:!bg-skyblue/20 hover:!bg-blue/20 hover:!text-blue hover:dark:!text-skyblue',
            !allSelected && networks && networks?.length > 0
              ? '!bg-blue/10 dark:!bg-skyblue/10 !text-blue dark:!text-skyblue !border-blue dark:!border-skyblue !border-1 !border-solid'
              : '',
          )}
        >
          {!allSelected && networks && networks?.length > 0 ? (
            <>
              <span>Network: </span>
              <div>{getNetworkName(networks[0])}</div>
              <div>
                {networks.length > 1 ? ` +${networks.length - 1}` : null}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearSelections()
                }}
                className="py-2 px-0.5"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span>Network</span>
          )}
        </Button>
      }
      content={
        <Command className="flex items-center">
          <div className="m-2 mt-3 w-full md:w-[90%] rounded-md bg-slate-200 dark:bg-slate-750 dark:border-[#FFFFFF14] border-transparent border">
            <CommandInput
              testdata-id="network-selector-input"
              placeholder="Search network..."
              className="!max-h-[39px] w-full text-xs"
            />
          </div>

          {allSelected ? (
            <div className="pl-1 mr-auto">
              <Button
                variant="ghost"
                size="xs"
                className="font-medium text-blue dark:text-skyblue"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          ) : null}

          <CommandGroup className="!overflow-x-hidden !overflow-y-scroll scroll max-h-[300px]">
            {DEFAULT_POOL_NETWORKS.map((_network) => {
              const name = getNetworkName(_network)
              const isSelected = networks?.includes(_network)

              return (
                <CommandItem
                  key={_network}
                  value={`${name}__${_network}`}
                  onSelect={onSelect}
                  className={classNames(
                    'py-2 pr-2 hover:bg-[#0000000A] hover:dark:bg-[#FFFFFF0A]',
                  )}
                >
                  <NetworkIcon
                    type="circle"
                    chainId={_network}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {name}
                  {isSelected ? (
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center bg-blue dark:bg-skyblu p-0.5 rounded-sm">
                      <CheckIcon
                        strokeWidth={3}
                        width={16}
                        height={16}
                        className="text-slate-200 dark:text-slate-750"
                      />
                    </span>
                  ) : null}
                </CommandItem>
              )
            })}
          </CommandGroup>

          <CommandEmpty>No network found.</CommandEmpty>
        </Command>
      }
    />
  )
}
