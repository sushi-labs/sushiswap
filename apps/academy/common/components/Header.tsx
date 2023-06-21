import { GlobalNav, NavLink, SubNav, SubNavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { DOCS_URL } from 'common/helpers'
import { getDifficulties, getProducts } from 'lib/api'
import React, { FC, useMemo } from 'react'
import useSWR from 'swr'

import { MobileMenu } from './'

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
const BASE_URL = '/academy'

export const Header: FC = () => {
  const { data: productsData } = useSWR('/products', async () => (await getProducts())?.products)
  const { data: difficultiesData } = useSWR('/difficulties', async () => (await getDifficulties())?.difficulties)

  const products = useMemo(() => productsData?.data ?? [], [productsData?.data])
  const difficulties = useMemo(() => difficultiesData?.data ?? [], [difficultiesData?.data])
  const sortedProducts = products.sort((a, b) =>
    PRODUCTS_ORDER.indexOf(a?.attributes?.slug as (typeof PRODUCTS_ORDER)[number]) >
    PRODUCTS_ORDER.indexOf(b?.attributes?.slug as (typeof PRODUCTS_ORDER)[number])
      ? 1
      : -1
  )

  const navData: HeaderSection[] = useMemo(
    () => [
      { title: 'Academy', href: BASE_URL },
      {
        title: 'Products',
        links: sortedProducts.map(({ attributes }) => ({
          name: attributes?.longName as string,
          href: `${BASE_URL}/products/${attributes?.slug}`,
        })),
      },
      {
        title: 'Learn',
        links: difficulties?.map(({ attributes }) => {
          const isTechnical = attributes?.slug === 'technical'
          return {
            name: attributes?.shortDescription as string,
            href: isTechnical ? DOCS_URL : `${BASE_URL}/articles?difficulty=${attributes?.slug}`,
            isExternal: isTechnical,
          }
        }),
      },
      { title: 'Blog', href: 'https://www.sushi.com/blog', isExternal: true },
      { title: 'About', href: `${BASE_URL}/about` },
    ],
    [difficulties, sortedProducts]
  )

  return (
    <GlobalNav maxWidth="6xl">
      <>
        {navData.map(({ title, href, links, isExternal }) => {
          if (href && !links) {
            return <NavLink title={title} href={href} key={title} />
          }

          return (
            <SubNav title={title} key={title}>
              {links?.map(({ name, href }) => (
                <SubNavLink href={href} title={name} key={`${title}-${name}`} />
              ))}
            </SubNav>
          )
        })}
      </>

      <MobileMenu navData={navData} />
    </GlobalNav>
  )
}
