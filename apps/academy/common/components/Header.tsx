import { Listbox } from '@headlessui/react'
import { ChevronDownIcon, MenuIcon } from '@heroicons/react/outline'
import { App, classNames, Link, Select, Typography } from '@sushiswap/ui'
import { AppType } from '@sushiswap/ui/app/Header'
import { FC } from 'react'

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
  return (
    <App.Header appType={AppType.Blog} className="border-b bg-slate-900 border-slate-200/5" maxWidth="5xl">
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
        <Select
          button={
            <Listbox.Button type="button" className="p-1.5 bg-[#A6AAB54D] rounded">
              <MenuIcon className="w-4 h-4" aria-hidden="true" />
            </Listbox.Button>
          }
        >
          <Select.Options className="w-[240px] !bg-slate-700 -ml-5 mt-5 max-h-[unset] p-6 gap-6 flex flex-col right-0">
            {headerLinks.map(({ title, options }) => (
              <div key={title}>
                <Typography variant="xs" weight={600} className="mb-2 uppercase text-slate-400">
                  {title}
                </Typography>
                <div className="px-2 space-y-2">
                  {options.map(({ option, href }, i) => (
                    <Link.Internal href={href} key={i}>
                      <Typography weight={500} variant="sm">
                        {option}
                      </Typography>
                    </Link.Internal>
                  ))}
                </div>
              </div>
            ))}
          </Select.Options>
        </Select>
      </nav>
    </App.Header>
  )
}
