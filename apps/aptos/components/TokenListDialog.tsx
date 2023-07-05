import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import TokenListItem from './TokenListItem'
import { Token } from 'utils/tokenType'
import { SlideIn } from '@sushiswap/ui/future/components/animation'
import { List } from '@sushiswap/ui/future/components/list/List'
type PropType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  tokens: object
  handleChangeToken: (token: Token) => void
  selected: Token[]
}
export default function TokenListDialog({ open, setOpen, tokens, handleChangeToken, selected }: PropType) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1080]" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 paper bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex flex-col gap-3 !pb-1 min-h-[75vh] sm:min-h-[60vh] px-4 sm:!rounded-[24px] p-4 overflow-hidden text-left max-w-md w-full h-full bg-gray-50/80 paper dark:bg-slate-800/80 shadow-xl align-middle transition-all transform rounded-t-2xl rounded-b-none relative">
                <SlideIn>
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">Tokens</span>
                  </div>
                  <List.Control className="relative flex flex-col flex-grow gap-3 p-1">
                    {tokens?.tokens.map((token: Token, key: number) => {
                      return (
                        <TokenListItem
                          selected={selected}
                          token={token}
                          key={key}
                          handleChangeToken={handleChangeToken}
                        />
                      )
                    })}
                  </List.Control>
                </SlideIn>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
