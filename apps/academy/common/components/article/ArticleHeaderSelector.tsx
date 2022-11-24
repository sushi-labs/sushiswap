import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { classNames, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { ComponentSharedTableOfContentsEntry } from '.mesh'

interface ArticleHeaderSelector {
  selectedHeader: string
  setSelectedHeader: (header: string) => void
  tableOfContents: ComponentSharedTableOfContentsEntry[]
  scrollToHeader: (id: string) => void
}
export const ArticleHeaderSelector: FC<ArticleHeaderSelector> = ({
  selectedHeader,
  setSelectedHeader,
  tableOfContents,
  scrollToHeader,
}) => {
  return (
    <Disclosure as="div" className="sticky top-[94px] sm:hidden bg-slate-900 z-20 px-6 border-b border-slate-200/5">
      {({ open, close }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between w-full h-12 gap-1 text-slate-40 outline-0">
            <Typography variant="sm" weight={500}>
              {selectedHeader || tableOfContents?.[0].text}
            </Typography>
            <ChevronDownIcon width={12} height={12} className={classNames('transition', open && 'rotate-180')} />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="grid gap-3 pb-6 mt-2">
              <ol className="grid gap-3 list-decimal list-inside">
                {tableOfContents?.map(({ key, text }) => (
                  <li
                    key={key}
                    className={classNames(
                      'cursor-pointer',
                      selectedHeader === text ? 'text-slate-50' : 'text-slate-400'
                    )}
                    onClick={() => {
                      close()
                      scrollToHeader(key)
                      setSelectedHeader(text)
                    }}
                  >
                    <Typography variant="sm" weight={500} as="span">
                      {text}
                    </Typography>
                  </li>
                ))}
              </ol>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
