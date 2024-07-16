'use client'

import stringify from 'fast-json-stable-stringify'
import { FC, useCallback, useState } from 'react'
import useSWR from 'swr'

import { PlusCircleIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Command,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
import { CheckIcon } from '@sushiswap/ui/icons/CheckIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { Chain, ChainId } from 'sushi/chain'
import { ANALYTICS_CHAIN_IDS } from '../../config'
import { TVLChart } from './tvl-chart'
import { VolumeChart } from './volume-chart'

const isAllThenNone = (chainIds: number[]) =>
  ANALYTICS_CHAIN_IDS.length === chainIds.length ? [] : chainIds

const fetcher = ({ url, chainIds }: { url: string; chainIds: ChainId[] }) => {
  const _url = new URL(url, window.location.origin)
  _url.searchParams.set(
    'networks',
    stringify(chainIds.length > 0 ? chainIds : ANALYTICS_CHAIN_IDS),
  )

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const GlobalStatsCharts: FC = () => {
  const [open, setOpen] = useState(false)
  const [localValue, setValues] = useState<number[]>(
    isAllThenNone(ANALYTICS_CHAIN_IDS),
  )
  const { data } = useSWR(
    { url: '/analytics/api/charts', chainIds: localValue },
    fetcher,
  )

  const onClick = useCallback(
    (chainId: ChainId) => {
      let _newValues: number[]
      if (localValue.includes(chainId)) {
        _newValues = localValue.filter((el) => el !== chainId)
      } else {
        _newValues = [...(localValue ?? []), chainId]
      }
      setValues(_newValues)
    },
    [localValue],
  )

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader className="flex justify-end border-b border-accent py-3">
          <div className="flex gap-3 items-center">
            <span className="font-medium text-sm">Filter by</span>
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
                  {localValue?.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="m-1 !h-4" />
                      <Chip variant="secondary" className="lg:hidden">
                        {localValue.length}
                      </Chip>
                      <div className="hidden lg:flex gap-1">
                        {localValue.length > 2 ? (
                          <Chip variant="secondary">
                            {localValue.length} selected
                          </Chip>
                        ) : (
                          ANALYTICS_CHAIN_IDS.filter((option) =>
                            localValue.includes(option),
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
                    {ANALYTICS_CHAIN_IDS.map((chainId) => (
                      <CommandItem
                        key={chainId}
                        value={`${chainId}`}
                        onSelect={(currentValue) =>
                          onClick(+currentValue as ChainId)
                        }
                        className="py-2 pl-8 pr-2"
                      >
                        {localValue.includes(chainId) ? (
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
          </div>
        </CardHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-accent divide-y lg:divide-y-0">
          <TVLChart x={data?.[0]?.[0]} y={data?.[0]?.[1]} />
          <VolumeChart x={data?.[1]?.[0]} y={data?.[1]?.[1]} />
        </div>
      </Card>
    </div>
  )
}
