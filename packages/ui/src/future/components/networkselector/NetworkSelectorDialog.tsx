import { Popover } from '@headlessui/react'
import chains from '@sushiswap/chain'
import classNames from 'classnames'
import React, { FC, useState } from 'react'

import { Dialog } from '../dialog'
import { NetworkIcon } from '../icons'
import { Search } from '../input/Search'
import { NetworkSelectorProps } from './index'

export const NetworkSelectorDialog = <T extends number>({
  networks,
  onSelect,
  selected,
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [query, setQuery] = useState<string>('')

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {typeof children === 'function' ? children({ open, close }) : children}
          <Dialog open={open} onClose={() => close()}>
            <Dialog.Content className="flex flex-col gap-2 scroll sm:overflow-hidden !pb-0 !h-[75vh] sm:!h-[640px]">
              <Popover.Panel className="overflow-hidden">
                <Search id="network-selector" value={query} loading={false} onChange={setQuery} />
                <div className="h-[calc(100%-44px)] scroll overflow-auto py-3">
                  {networks
                    .filter((el) => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                    .map((el) => (
                      <button
                        onClick={() => onSelect(el, close)}
                        key={el}
                        className={classNames(
                          'w-full group hover:bg-black/[0.04] hover:dark:bg-white/[0.06] px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <NetworkIcon chainId={el} width={24} height={24} />
                          <p
                            className={classNames(
                              selected === el
                                ? 'text-gray-900 dark:text-white font-medium'
                                : 'text-gray-600 dark:text-slate-400'
                            )}
                          >
                            {chains[el].name}
                          </p>
                        </div>
                        {selected === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
                      </button>
                    ))}
                </div>
              </Popover.Panel>
            </Dialog.Content>
          </Dialog>
        </>
      )}
    </Popover>
  )
}
