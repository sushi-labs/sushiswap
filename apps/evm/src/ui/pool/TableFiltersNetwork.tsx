'use client'

import { PlusCircleIcon } from '@heroicons/react/24/outline'
import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@sushiswap/ui/components/command'
import { CheckIcon, NetworkIcon } from '@sushiswap/ui/components/icons'
import React, { FC, useCallback, useState, useTransition } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { Chain } from 'sushi/chain'

import { usePoolFilters, useSetPoolFilters } from './PoolsFiltersProvider'

const isAllThenNone = (chainIds: number[]) =>
  SUPPORTED_CHAIN_IDS.length === chainIds.length ? [] : chainIds

export const TableFiltersNetwork: FC = () => {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const { chainIds } = usePoolFilters()
  const setFilters = useSetPoolFilters()
  const [localValue, setValues] = useState<number[]>(isAllThenNone(chainIds))

  const values = pending ? localValue : isAllThenNone(chainIds)

  const onClick = useCallback(
    (chainId: (typeof chainIds)[number]) => {
      let _newValues: number[]
      if (localValue.includes(chainId)) {
        _newValues = localValue.filter((el) => el !== chainId)
      } else {
        _newValues = [...(localValue ?? []), chainId]
      }
      setValues(_newValues)

      startTransition(() => {
        setFilters((prev) => {
          if (prev.chainIds?.includes(chainId)) {
            const chains = prev.chainIds!.filter((el) => el !== chainId)
            return { ...prev, chainIds: chains }
          } else {
            return { ...prev, chainIds: [...(prev.chainIds ?? []), chainId] }
          }
        })
      })
    },
    [setFilters, localValue],
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
                  SUPPORTED_CHAIN_IDS.filter((option) =>
                    values.includes(option),
                  ).map((option) => (
                    <Chip variant="secondary" key={option}>
                      {Chain.from(option)?.name}
                    </Chip>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll"
      >
        <Command className="flex items-center gap-1">
          <CommandGroup>
            {SUPPORTED_CHAIN_IDS.map((chainId) => (
              <CommandItem
                key={chainId}
                value={`${chainId}`}
                onSelect={(currentValue) =>
                  onClick(+currentValue as (typeof chainIds)[number])
                }
                className="py-2 pl-8 pr-2"
              >
                {values.includes(chainId) ? (
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
                  chainId={chainId}
                  width={20}
                  height={20}
                  className="mr-2"
                />
                {Chain.from(chainId)?.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
