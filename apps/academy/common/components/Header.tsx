import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { App, AppType, classNames, Link, Select, Typography } from '@sushiswap/ui'
import { DOCS_URL } from 'common/helpers'
import { getDifficulties, getProducts } from 'lib/api'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR from 'swr'

import { MobileMenu } from '.'

interface HeaderLink {
  name: string
  href: string
  isExternal?: boolean
}

export interface HeaderSection {
  title: string
  href?: string
  links?: HeaderLink[]
  isExternal?: boolean
}

const PRODUCTS_ORDER = ['trident', 'furo', 'sushixswap', 'onsen', 'kashi', 'miso', 'bentobox']

export const Header: FC = () => {
  const { data: productsData } = useSWR('/products', async () => (await getProducts())?.products)
  const { data: difficultiesData } = useSWR('/difficulties', async () => (await getDifficulties())?.difficulties)
  const { pathname } = useRouter()

  const products = useMemo(() => productsData?.data ?? [], [productsData?.data])
  const difficulties = useMemo(() => difficultiesData?.data ?? [], [difficultiesData?.data])
  const sortedProducts = products.sort((a, b) =>
    PRODUCTS_ORDER.indexOf(a?.attributes?.slug as typeof PRODUCTS_ORDER[number]) >
    PRODUCTS_ORDER.indexOf(b?.attributes?.slug as typeof PRODUCTS_ORDER[number])
      ? 1
      : -1
  )

  const navData: HeaderSection[] = useMemo(
    () => [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'About',
        href: '/about',
      },
      {
        title: 'Products',
        links: sortedProducts.map(({ attributes }) => ({
          name: attributes?.longName as string,
          href: `/products/${attributes?.slug}`,
        })),
      },
      {
        title: 'Learn',
        links: difficulties?.map(({ attributes }) => {
          const isTechnical = attributes?.slug === 'technical'
          return {
            name: attributes?.shortDescription as string,
            href: isTechnical ? DOCS_URL : `/articles?difficulty=${attributes?.slug}`,
            isExternal: isTechnical,
          }
        }),
      },
      {
        title: 'Blog',
        href: 'https://sushi.com/blog',
        isExternal: true,
      },
    ],
    [difficulties, sortedProducts]
  )

  return (
    <App.Header appType={AppType.Academy} withScrollBackground maxWidth="6xl">
      <nav className="items-center hidden sm:flex gap-14">
        {navData.map(({ title, href, links, isExternal }, i, a) => {
          if (href && !links) {
            return isExternal ? (
              <Link.External href={href} key={title}>
                <Typography weight={700}>{title}</Typography>
              </Link.External>
            ) : (
              <Link.Internal href={href} key={title}>
                <Typography weight={700}>{title}</Typography>
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
                  i >= a.length - 2 && '2xl:right-[unset] right-0',
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
                    <Link.Internal key={href} href={href}>
                      <Select.Option
                        value={name}
                        className={classNames('border-0 pr-10 !cursor-pointer', pathname === href && 'bg-blue-500')}
                      >
                        {name}
                      </Select.Option>
                    </Link.Internal>
                  )
                )}
              </Select.Options>
            </Select>
          )
        })}
      </nav>

      <MobileMenu navData={navData} />
    </App.Header>
  )
}
