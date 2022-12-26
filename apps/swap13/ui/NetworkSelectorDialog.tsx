import { ChevronDownIcon } from '@heroicons/react/20/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui13'
import { Button } from '@sushiswap/ui13/components/button'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { Search } from '@sushiswap/ui13/components/input/Search'
import React, { FC, useCallback, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'

interface NetworkSelectorDialogProps {
  selected: ChainId
  onSelect(chainId: ChainId): void
}

export const NetworkSelectorDialog: FC<NetworkSelectorDialogProps> = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string>('')

  const handleSelect = useCallback(
    (el: ChainId) => {
      onSelect(el)
      setOpen(false)
    },
    [onSelect]
  )

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outlined" color="default" size="xl" className="!px-3">
        <NetworkIcon chainId={selected} width={32} height={32} />
        <ChevronDownIcon width={36} height={36} />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="!max-w-md overflow-hidden h-[75vh] sm:h-[640px] !pt-4 !pb-4 rounded-2xl">
          <>
            <Search id="" value={query} loading={false} onChange={setQuery} />
            <div className="py-2 h-full scroll">
              {SUPPORTED_CHAIN_IDS.filter((el) =>
                query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean
              ).map((el) => (
                <button
                  onClick={() => handleSelect(el)}
                  key={el}
                  className={classNames(
                    'w-full group hover:bg-gray-100 hover:bg-white hover:dark:bg-slate-800 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <NetworkIcon
                      type="naked"
                      chainId={el}
                      width={24}
                      height={24}
                      className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                    />
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 dark:text-slate-300 group-hover:dark:text-slate-50">
                      {chains[el].name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
