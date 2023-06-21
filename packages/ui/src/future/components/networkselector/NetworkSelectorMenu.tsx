import chains, { Chain } from '@sushiswap/chain'
import React, { useState } from 'react'

import { NetworkIcon } from '../icons'
import { Search } from '../input/Search'
import { NetworkSelectorProps } from './index'
import { Select, SelectContent, SelectItem } from '../select'
import { ScrollArea } from '../scroll-area'
import { Separator } from '../separator'

export const NetworkSelectorMenu = <T extends number>({
  selected,
  onSelect,
  networks = [],
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [query, setQuery] = useState('')

  return (
    <Select value={`${selected}`} onValueChange={(val) => onSelect(+val as T, () => {})}>
      {children}
      <SelectContent>
        <Search id="" value={query} loading={false} onValueChange={setQuery} />
        <Separator className="my-1" />
        <ScrollArea className="h-72" type="auto">
          {networks
            .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
            .map((el) => (
              <SelectItem value={`${el}`} key={el}>
                <div className="flex items-center gap-2">
                  <NetworkIcon chainId={el} width={16} height={16} />
                  {Chain.from(el).name}
                </div>
              </SelectItem>
            ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  )
}
