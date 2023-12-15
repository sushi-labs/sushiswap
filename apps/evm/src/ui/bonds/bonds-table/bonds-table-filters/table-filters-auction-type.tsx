'use client'

import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { AuctionType, AuctionTypes } from '@sushiswap/bonds-sdk'
import { useMutationObserver } from '@sushiswap/hooks'
import {
  Chip,
  CommandList,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Label,
  Popover,
  PopoverContent,
  PopoverPrimitive,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@sushiswap/ui/components/command'
import { CheckIcon } from '@sushiswap/ui/components/icons'
import React, { FC, useCallback, useState, useTransition } from 'react'
import { useBondFilters, useSetBondFilters } from './bonds-filters-provider'

const AUCTIONTYPE_DESCRIPTIONS: Record<AuctionType, string> = {
  [AuctionType.Static]:
    'A fixed-price auction type that enabled issuers to set a fixed price that bonders must pay to obtain payout tokens.',
  [AuctionType.Dynamic]: '',
}

const isAllThenNone = (auctionTypes: AuctionType[] | undefined) =>
  !auctionTypes || auctionTypes.length === AuctionTypes.length
    ? []
    : auctionTypes

export const TableFiltersAuctionType: FC = () => {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const { auctionTypes } = useBondFilters()
  const setFilters = useSetBondFilters()
  const [peekedAuctionType, setPeekedAuctionType] = React.useState<AuctionType>(
    AuctionType.Static,
  )
  const [localValue, setValues] = useState<AuctionType[]>(
    isAllThenNone(auctionTypes),
  )

  const values = pending ? localValue : isAllThenNone(auctionTypes)

  const auctionTypeHandler = useCallback(
    (item: AuctionType) => {
      let _newValues: AuctionType[]
      if (values?.includes(item)) {
        _newValues = values.filter((el) => el !== item)
      } else {
        _newValues = [...(values ?? []), item]
      }
      setValues(_newValues)

      startTransition(() => {
        setFilters((prev) => {
          if (prev.auctionTypes?.includes(item)) {
            const auctionTypes = prev.auctionTypes.filter((el) => el !== item)
            return { ...prev, auctionTypes }
          } else {
            return {
              ...prev,
              auctionTypes: [...(prev.auctionTypes ?? []), item],
            }
          }
        })
      })
    },
    [setFilters, values],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          icon={PlusCircleIcon}
          aria-label="Select a auctionType"
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className="!border-dashed"
        >
          <span>Auction Type</span>
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
                  AuctionTypes.filter((option) => values.includes(option)).map(
                    (option) => (
                      <Chip variant="secondary" key={option}>
                        {AuctionType[option]}
                      </Chip>
                    ),
                  )
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="!w-[unset] !p-0">
        <HoverCard>
          <PopoverPrimitive.Portal>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="hidden md:block w-[240px]"
            >
              <div className="flex flex-col gap-2">
                <Label>{AuctionType[peekedAuctionType]}</Label>
                <div className="text-sm text-muted-foreground">
                  {AUCTIONTYPE_DESCRIPTIONS[peekedAuctionType]}
                </div>
              </div>
            </HoverCardContent>
          </PopoverPrimitive.Portal>
          <Command className="flex items-center gap-1">
            <CommandList>
              <HoverCardTrigger />
              <CommandGroup>
                {AuctionTypes.map((el) => (
                  <AuctionTypeItem
                    selected={values}
                    key={el}
                    auctionType={el}
                    onPeek={(auctionType) => setPeekedAuctionType(auctionType)}
                    onSelect={() => auctionTypeHandler(el)}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </HoverCard>
      </PopoverContent>
    </Popover>
  )
}

interface AuctionTypeItemProps {
  auctionType: AuctionType
  onSelect: () => void
  selected: AuctionType[]
  onPeek: (model: AuctionType) => void
}

const AuctionTypeItem: FC<AuctionTypeItemProps> = ({
  selected,
  auctionType,
  onSelect,
  onPeek,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'aria-selected') {
          onPeek(auctionType)
        }
      }
    }
  })

  return (
    <CommandItem
      ref={ref}
      key={auctionType}
      value={auctionType}
      onSelect={onSelect}
      className="py-2 pl-8 pr-2 cursor-pointer"
    >
      {selected.includes(auctionType) ? (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <CheckIcon
            strokeWidth={3}
            width={16}
            height={16}
            className="text-blue"
          />
        </span>
      ) : null}
      {AuctionType[auctionType]}
    </CommandItem>
  )
}
