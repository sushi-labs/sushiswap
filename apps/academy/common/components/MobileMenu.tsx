import { Disclosure, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { classNames, Link, SushiIcon, Typography } from '@sushiswap/ui'
import { SushiTransparentIcon, TriangleIcon } from 'common/icons'
import { FC, useCallback, useState } from 'react'

import { Drawer } from './Drawer'
import { HeaderSection } from './Header'

interface MobileMenu {
  navData: HeaderSection[]
}
export const MobileMenu: FC<MobileMenu> = ({ navData }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => {
    document.body.className = 'scroll-lock'
    setIsOpen(true)
  }, [])
  const onClose = useCallback(() => {
    document.body.className = ''
    setIsOpen(false)
  }, [])

  return (
    <nav className="sm:hidden">
      <button className="p-1.5 bg-slate-900 rounded hover:opacity-80" onClick={onOpen}>
        <Bars3Icon className="w-5 h-5" aria-hidden="true" />
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        className="flex flex-col h-screen"
        header={
          <div className="pl-[30px]">
            <SushiIcon width={32} height={32} />
          </div>
        }
      >
        <div className="grid gap-12 mt-7">
          {navData.map(({ title, href, links, isExternal }) => {
            if (href && !links) {
              return isExternal ? (
                <Link.External href={href} key={title}>
                  <Typography variant="h3" weight={700} className="text-slate-50" onClick={onClose}>
                    {title}
                  </Typography>
                </Link.External>
              ) : (
                <Link.Internal href={href} key={title}>
                  <Typography variant="h3" weight={700} className="text-slate-50" onClick={onClose}>
                    {title}
                  </Typography>
                </Link.Internal>
              )
            }
            return (
              <Disclosure key={title} as="div">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center gap-6">
                      <TriangleIcon className={classNames('transition', open && 'rotate-90')} />
                      <Typography variant="h3" weight={700} className="text-slate-50">
                        {title}
                      </Typography>
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="grid gap-7 pl-7 pb-1.5 mt-9">
                        {links?.map(({ name, href, isExternal }) =>
                          isExternal ? (
                            <Link.External key={href} href={href}>
                              <Typography weight={500} className="text-slate-400" onClick={onClose}>
                                {name}
                              </Typography>
                            </Link.External>
                          ) : (
                            <Link.Internal key={href} href={href}>
                              <Typography weight={500} className="text-slate-400" onClick={onClose}>
                                {name}
                              </Typography>
                            </Link.Internal>
                          )
                        )}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            )
          })}
          <div className="fixed bottom-0 right-0 -z-[1]">
            <SushiTransparentIcon />
          </div>
        </div>
      </Drawer>
    </nav>
  )
}
