'use client'

import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Chain, ChainId } from '@sushiswap/chain'
import { Chip, Popover, PopoverContent, PopoverTrigger, Separator } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Command, CommandGroup, CommandItem } from '@sushiswap/ui/components/command'
import { CheckIcon, NetworkIcon } from '@sushiswap/ui/components/icons'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { usePoolFilters, useSetPoolFilters } from './PoolsFiltersProvider'

export const TableFiltersNetwork: FC = () => {
  const [open, setOpen] = useState(false)
  const { chainIds } = usePoolFilters()
  const setFilters = useSetPoolFilters()
  const values = useMemo(() => (SUPPORTED_CHAIN_IDS.length === chainIds.length ? [] : chainIds), [chainIds])

  const onClick = useCallback(
    (chainId: ChainId) => {
      setFilters((prev) => {
        if (prev.chainIds?.includes(chainId)) {
          const chains = prev.chainIds.filter((el) => el !== chainId)
          return { ...prev, chainIds: chains }
        } else {
          return { ...prev, chainIds: [...(prev.chainIds ?? []), chainId] }
        }
      })
    },
    [setFilters]
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
          className="!border-dashed"
        >
          <span>Networks</span>
          {values?.length > 0 && (
            <>
              <Separator orientation="vertical" className="m-1 !h-4" />
              <Chip variant="secondary" className="lg:hidden">
                {values.length}
              </Chip>
              <div className="hidden lg:flex gap-1">
                {values.length > 2 ? (
                  <Chip variant="secondary">{values.length} selected</Chip>
                ) : (
                  SUPPORTED_CHAIN_IDS.filter((option) => values.includes(option)).map((option) => (
                    <Chip variant="secondary" key={option}>
                      {Chain.from(option).name}
                    </Chip>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command className="flex items-center gap-1">
          <CommandGroup>
            {SUPPORTED_CHAIN_IDS.map((chainId) => (
              <CommandItem
                key={chainId}
                value={`${chainId}`}
                onSelect={(currentValue) => onClick(+currentValue as ChainId)}
                className="py-2 pl-8 pr-2"
              >
                {values.includes(chainId) ? (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <CheckIcon strokeWidth={3} width={16} height={16} className="text-blue" />
                  </span>
                ) : null}
                <NetworkIcon chainId={chainId} width={20} height={20} className="mr-2" />
                {Chain.from(chainId).name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
