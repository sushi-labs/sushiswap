import { Chain, ChainId } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui/components/button'
import { Command, CommandGroup, CommandItem } from '@sushiswap/ui/components/command'
import { CheckIcon, NetworkIcon } from '@sushiswap/ui/components/icons'
import { PopoverContent, PopoverNew, PopoverTrigger } from '@sushiswap/ui/components/popovernew'
import { SelectIcon } from '@sushiswap/ui/components/select'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'

export const TableFiltersNetwork: FC = () => {
  const [open, setOpen] = useState(false)
  const { chainIds, setFilters } = usePoolFilters()
  const values = useMemo(() => (SUPPORTED_CHAIN_IDS.length === chainIds.length ? [] : chainIds), [chainIds])
  const onClick = useCallback(
    (chainId: ChainId) => {
      if (values.includes(chainId)) {
        const chains = values.filter((el) => el !== chainId)
        setFilters({ chainIds: chains.length === 0 ? SUPPORTED_CHAIN_IDS : chains })
      } else {
        setFilters({ chainIds: [...values, chainId] })
      }
    },
    [values, setFilters]
  )
  return (
    <PopoverNew modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" role="combobox" aria-expanded={open}>
          <span>Networks</span>
          <SelectIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll">
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
    </PopoverNew>
  )
}
