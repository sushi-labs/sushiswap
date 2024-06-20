'use client'

import {
  Container,
  EXPLORE_NAVIGATION_LINKS,
  NavigationContainer,
  NavigationListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // OnramperButton,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'
// import { getDifficulties, getProducts } from 'lib/api'
import React, { FC, useMemo } from 'react'
import useSWR from 'swr'
import { DOCS_URL } from './constants'

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

const PRODUCTS_ORDER = [
  'trident',
  'furo',
  'sushixswap',
  'onsen',
  'kashi',
  'bentobox',
]

export const Header: FC = () => {
  // const { data: productsData } = useSWR(
  //   '/products',
  //   async () =>
  //     (await getProducts({ filters: { show: { eq: true } } }))?.products,
  // )
  // const { data: difficultiesData } = useSWR(
  //   '/difficulties',
  //   async () => (await getDifficulties())?.difficulties,
  // )

  const productsData = { data: [] } as { data: any[] }
  const difficultiesData = { data: [] } as { data: any[] }

  const products = useMemo(() => productsData?.data ?? [], [productsData?.data])
  const difficulties = useMemo(
    () => difficultiesData?.data ?? [],
    [difficultiesData?.data],
  )
  const sortedProducts = products.sort((a, b) =>
    PRODUCTS_ORDER.indexOf(
      a?.attributes?.slug as (typeof PRODUCTS_ORDER)[number],
    ) >
    PRODUCTS_ORDER.indexOf(
      b?.attributes?.slug as (typeof PRODUCTS_ORDER)[number],
    )
      ? 1
      : -1,
  )

  const navData: HeaderSection[] = useMemo(
    () => [
      { title: 'Academy', href: '/' },
      {
        title: 'Products',
        links: sortedProducts.map(({ attributes }) => ({
          name: attributes?.longName as string,
          href: `/academy/products/${attributes?.slug}`,
        })),
      },
      {
        title: 'Learn',
        links: difficulties?.map(({ attributes }) => {
          const isTechnical = attributes?.slug === 'technical'
          return {
            name: attributes?.shortDescription as string,
            href: isTechnical
              ? DOCS_URL
              : `/articles?difficulty=${attributes?.slug}`,
            isExternal: isTechnical,
          }
        }),
      },
      { title: 'Blog', href: 'https://www.sushi.com/blog', isExternal: true },
      { title: 'About', href: '/about' },
    ],
    [difficulties, sortedProducts],
  )

  return (
    <Container maxWidth="6xl" className="mx-auto">
      <NavigationContainer variant="transparent">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[400px] gap-3 p-4">
                  {EXPLORE_NAVIGATION_LINKS.map((component) => (
                    <NavigationListItem
                      legacyBehavior={true}
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </NavigationListItem>
                  ))}
                  {/* <OnramperButton>
                    <NavigationListItem title="Buy Crypto">
                      Need to buy some more crypto?
                    </NavigationListItem>
                  </OnramperButton> */}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {navData.map(({ title, href, links }) => {
              if (href && !links) {
                return (
                  <NavigationMenuItem key={href}>
                    <NavigationMenuLink
                      href={href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              }

              return (
                <NavigationMenuItem key={title}>
                  <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-[400px] gap-3 p-4">
                      {links?.map(({ name, href }) => (
                        <NavigationListItem
                          legacyBehavior={true}
                          key={`${title}-${name}`}
                          title={name.split('-')?.[0]}
                          href={href}
                        >
                          {name.split('-')?.[1]}
                        </NavigationListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </NavigationContainer>
    </Container>
  )
}
