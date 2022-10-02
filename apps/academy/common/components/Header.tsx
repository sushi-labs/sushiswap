import { Listbox } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { App, classNames, IconButton, Link, Select, SushiIcon, Typography, useBreakpoint } from '@sushiswap/ui'
import { AppType } from '@sushiswap/ui/app/Header'
import { useDisclosure } from 'common/hooks'
import { SushiTransparentIcon, TriangleIcon } from 'common/icons'
import { FC, useState } from 'react'

import { Drawer } from './Drawer'

export const Header: FC = () => {
  // TODO: links
  const headerLinks = [
    {
      title: 'About',
      options: [
        { option: 'Tutorials & Explainers', href: '' },
        { option: 'Strategies & Deepdives', href: '' },
        { option: 'Technical Documentation', href: '' },
        { option: 'Samurai Knowledgebase & Support', href: '' },
      ],
    },
    {
      title: 'Products',
      options: [
        { option: 'Trident', href: '' },
        { option: 'Miso', href: '' },
        { option: 'Onsen', href: '' },
        { option: 'Shoyu', href: '' },
      ],
    },
    {
      title: 'Learn',
      options: [
        { option: 'How to get started', href: '' },
        { option: 'Advcance Tooling', href: '' },
        { option: 'Technical Documentation', href: '' },
      ],
    },
  ]

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [sectionOpen, setSectionOpen] = useState('')
  const toggleSection = (section: string) => {
    setSectionOpen((prev) => (prev === section ? '' : section))
  }
  const handleClose = () => {
    setSectionOpen('')
    onClose()
  }

  const { isSm } = useBreakpoint('sm')

  return (
    <>
      <App.Header appType={AppType.Academy} maxWidth="6xl" withScrollBackground={isSm}>
        <nav className="hidden md:flex gap-14">
          {headerLinks.map(({ title, options }, i) => (
            <Select
              key={title}
              button={
                <Listbox.Button
                  type="button"
                  className="flex items-center gap-1 font-medium hover:text-slate-200 text-slate-300"
                >
                  <span className="text-sm">{title}</span>
                  <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                </Listbox.Button>
              }
            >
              <Select.Options
                className={classNames(
                  'w-[217px] max-w-[240px] !bg-slate-700 -ml-5 mt-5 max-h-[unset] p-6 gap-6 flex flex-col',
                  i === headerLinks.length - 1 && 'right-0 xl:right-auto'
                )}
              >
                {options.map(({ option, href }, i) => (
                  <Link.Internal href={href} key={i}>
                    <Typography weight={500} variant="sm">
                      {option}
                    </Typography>
                  </Link.Internal>
                ))}
              </Select.Options>
            </Select>
          ))}
        </nav>

        <nav className="md:hidden">
          <IconButton type="button" className="p-1.5 bg-slate-900 rounded" onClick={onOpen}>
            <Bars3Icon className="w-5 h-5" aria-hidden="true" />
          </IconButton>

          <Drawer isOpen={isOpen} onClose={handleClose} className="flex flex-col h-screen">
            <>
              <div className="flex items-center justify-between w-full">
                <SushiIcon width={32} height={32} />
              </div>
              <div className="mt-[62px] grid gap-12">
                {headerLinks.map(({ title, options }) => (
                  <div key={title}>
                    <button className="flex items-center gap-6" onClick={() => toggleSection(title)}>
                      <TriangleIcon className={classNames(title === sectionOpen && 'rotate-90')} />
                      <Typography variant="h3" weight={700} className="text-slate-50">
                        {title}
                      </Typography>
                    </button>
                    {sectionOpen === title && (
                      <div className="grid gap-[28px] pb-1.5 pl-6 mt-9">
                        {options.map(({ option, href }, i) => (
                          <Link.Internal href={href} key={i}>
                            <Typography weight={500} className="text-slate-400">
                              {option}
                            </Typography>
                          </Link.Internal>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="absolute bottom-0 right-0">
                  <SushiTransparentIcon />
                </div>
              </div>
            </>
          </Drawer>
        </nav>
      </App.Header>
    </>
  )
}
