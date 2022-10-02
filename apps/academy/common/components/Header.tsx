import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { App, classNames, IconButton, Link, Select, SushiIcon, Typography, useBreakpoint } from '@sushiswap/ui'
import { AppType } from '@sushiswap/ui/app/Header'
import { useDisclosure } from 'common/hooks'
import { SushiTransparentIcon, TriangleIcon } from 'common/icons'
import { FC } from 'react'

import { Drawer } from './Drawer'

interface HeaderLink {
  name: string
  href: string
}

interface HeaderSection {
  title: string
  href?: string
  links?: HeaderLink[]
}

// TODO: links
const headerLinks: HeaderSection[] = [
  {
    title: 'About',
    href: './',
  },
  {
    title: 'Products',
    links: [
      { name: 'Trident', href: '' },
      { name: 'Miso', href: '' },
      { name: 'Onsen', href: '' },
      { name: 'Shoyu', href: '' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { name: 'Tutorials & Explainers', href: '' },
      { name: 'Strategies & Deepdives', href: '' },
      { name: 'Technical Documentation', href: '' },
      { name: 'Samurai Support', href: '' },
    ],
  },
  {
    title: 'Blog',
    links: [
      { name: 'Sushi News', href: '' },
      { name: 'Toshokan Community', href: '' },
    ],
  },
]

export const Header: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isSm } = useBreakpoint('sm')

  return (
    <>
      <App.Header appType={AppType.Academy} maxWidth="6xl" withScrollBackground={isSm}>
        <nav className="items-center hidden md:flex gap-14">
          {headerLinks.map(({ title, href, links }, i) => {
            if (href && !links) {
              return (
                <Link.Internal href={href} key={i}>
                  <Typography weight={700} className="text-slate-50">
                    {title}
                  </Typography>
                </Link.Internal>
              )
            }
            return (
              <Select
                key={title}
                button={
                  <Listbox.Button type="button" className="flex items-center gap-1 font-medium text-slate-50">
                    <span className="text-base font-bold">{title}</span>
                    <ChevronDownIcon width={12} height={12} aria-hidden="true" />
                  </Listbox.Button>
                }
              >
                <Select.Options
                  className={classNames(
                    'w-[217px] max-w-[240px] !bg-slate-700 -ml-5 mt-5 max-h-[unset] py-4 px-2 flex flex-col',
                    i === headerLinks.length - 2 && 'right-0 xl:right-auto',
                    i === headerLinks.length - 1 && 'right-0 2xl:right-auto'
                  )}
                >
                  {links.map(({ name, href }, i) => (
                    <Select.Option
                      as="a"
                      href={href}
                      key={i}
                      value={name}
                      className="border-0 !cursor-pointer grid group font-medium text-sm"
                    >
                      {name}
                    </Select.Option>
                  ))}
                </Select.Options>
              </Select>
            )
          })}
        </nav>

        <nav className="md:hidden">
          <IconButton type="button" className="p-1.5 bg-slate-900 rounded" onClick={onOpen}>
            <Bars3Icon className="w-5 h-5" aria-hidden="true" />
          </IconButton>

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
              {headerLinks.map(({ title, href, links }) => {
                if (href && !links) {
                  return (
                    <Link.Internal href={href} key={title}>
                      <Typography variant="h3" weight={700} className="text-slate-50">
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
                          <Disclosure.Panel className="grid gap-[28px] pl-7 pb-1.5 mt-9">
                            {links.map(({ name, href }, i) => (
                              <Link.Internal href={href} key={i}>
                                <Typography weight={500} className="text-slate-400">
                                  {name}
                                </Typography>
                              </Link.Internal>
                            ))}
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
      </App.Header>
    </>
  )
}
