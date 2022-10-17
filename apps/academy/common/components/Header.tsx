import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { App, classNames, IconButton, Link, Select, SushiIcon, Typography } from '@sushiswap/ui'
import { AppType } from '@sushiswap/ui/app/Header'
import { docsUrl } from 'common/helpers'
import { SushiTransparentIcon, TriangleIcon } from 'common/icons'
import { getDifficulties, getProducts } from 'lib/api'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import useSWR from 'swr'

import { Drawer } from './Drawer'

interface HeaderLink {
  name: string
  href: string
  isExternal?: boolean
}

interface HeaderSection {
  title: string
  href?: string
  links?: HeaderLink[]
  isExternal?: boolean
}

export const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: productsData } = useSWR('/products', async () => (await getProducts())?.products)
  const { data: difficultiesData } = useSWR('/difficulties', async () => (await getDifficulties())?.difficulties)
  const router = useRouter()
  const currentPath = router.pathname

  const products = productsData?.data ?? []
  const difficulties = difficultiesData?.data ?? []

  const onOpen = () => {
    document.body.className = 'scroll-lock'
    setIsOpen(true)
  }
  const onClose = () => {
    document.body.className = ''
    setIsOpen(false)
  }

  const navData: HeaderSection[] = [
    {
      title: 'Product',
      links: products.map(({ attributes: { name, slug } }) => ({
        name,
        href: `/academy/products/${slug}`,
      })),
    },
    {
      title: 'Learn',
      links: difficulties?.map(({ attributes: { shortDescription, slug } }) => {
        const isTechnical = slug === 'technical'
        return {
          name: shortDescription,
          href: isTechnical ? docsUrl : `/academy/articles?difficulty=${slug}`,
          isExternal: isTechnical,
        }
      }),
    },
    {
      title: 'Blog',
      href: 'https://sushi.com/blog',
      isExternal: true,
    },
  ]

  return (
    <App.Header appType={AppType.Academy} maxWidth="6xl" withScrollBackground>
      <nav className="items-center hidden sm:flex gap-14">
        {navData.map(({ title, href, links }, i) => {
          if (href && !links) {
            return (
              <Link.External href={href} key={title}>
                <Typography weight={700}>{title}</Typography>
              </Link.External>
            )
          }
          return (
            <Select
              key={title}
              onChange={() => null}
              button={
                <Listbox.Button type="button" className="flex items-center gap-1 font-medium text-slate-50">
                  <span className="text-base font-bold">{title}</span>
                  <ChevronDownIcon width={12} height={12} aria-hidden="true" />
                </Listbox.Button>
              }
            >
              <Select.Options
                className={classNames(
                  i && '2xl:right-[unset] right-0',
                  'min-w-max !bg-slate-700 -ml-5 mt-5 !max-h-[unset] p-2 space-y-1'
                )}
              >
                {links?.map(({ name, href, isExternal }) =>
                  isExternal ? (
                    <Link.External key={href} href={href}>
                      <Select.Option value={name} className="pr-10 border-0 !cursor-pointer">
                        {name}
                      </Select.Option>
                    </Link.External>
                  ) : (
                    <Select.Option
                      value={name}
                      className={classNames('border-0 pr-10 !cursor-pointer', currentPath === href && 'bg-blue-500')}
                      as="a"
                      href={href}
                      key={href}
                    >
                      {name}
                    </Select.Option>
                  )
                )}
              </Select.Options>
            </Select>
          )
        })}
      </nav>

      <nav className="sm:hidden">
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
            {navData.map(({ title, links }) => {
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
    </App.Header>
  )
}
