'use client'

import { Menu } from '@headlessui/react'
import chains, { ChainId } from '@sushiswap/chain'
import classNames from 'classnames'
import React, { FC, useCallback, useState } from 'react'

import { Dialog } from '../dialog'
import { NetworkIcon } from '../icons'
import { Search } from '../input/Search'
import { NetworkSelectorProps } from './index'

export const NetworkSelectorDialog: FC<Omit<NetworkSelectorProps, 'variant'>> = ({ networks, onSelect, children }) => {
  const [query, setQuery] = useState<string>('')
  const handleSelect = useCallback(
    (el: ChainId, close: () => void) => {
      onSelect(el, close)
      close()
    },
    [onSelect]
  )

  return (
    <Menu as="div">
      {({ open, close }) => (
        <>
          {typeof children === 'function' ? children({ open, close }) : children}
          <Dialog open={open} onClose={close}>
            <Dialog.Content className="!max-w-md overflow-scroll scroll sm:overflow-hidden h-full max-h-[75vh] sm:h-[640px] !pt-4 !pb-4 rounded-2xl">
              <>
                <Search id="" value={query} loading={false} onChange={setQuery} />
                <div className="py-2 h-full scroll overflow-auto">
                  {networks
                    .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                    .map((el) => (
                      <button
                        onClick={() => handleSelect(el, close)}
                        key={el}
                        className={classNames(
                          'w-full group hover:bg-white hover:dark:bg-slate-800 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
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
      )}
    </Menu>
  )
}
