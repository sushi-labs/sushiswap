import { getDifficulties, getProducts } from '@sushiswap/graph-client/strapi'
import {
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
  buttonVariants,
} from '@sushiswap/ui'
// import { getDifficulties, getProducts } from 'lib/api'
import React from 'react'
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
  className?: string
}

const PRODUCTS_ORDER = ['furo', 'sushixswap', 'onsen', 'bentobox']

export async function Header() {
  const [products, difficulties] = await Promise.all([
    getProducts(),
    getDifficulties(),
  ])

  const sortedProducts = products.sort((a, b) =>
    PRODUCTS_ORDER.indexOf(a.slug as (typeof PRODUCTS_ORDER)[number]) >
    PRODUCTS_ORDER.indexOf(b.slug as (typeof PRODUCTS_ORDER)[number])
      ? 1
      : -1,
  )

  const navData: HeaderSection[] = [
    { title: 'Academy', href: '/academy' },
    { title: 'Blog', href: '/blog' },
    {
      title: 'Products',
      links: sortedProducts.map(({ longName, slug }) => ({
        name: longName,
        href: `/academy/products/${slug}`,
      })),
      className: 'hidden md:flex',
    },
    {
      title: 'Learn',
      links: difficulties?.map(({ shortDescription, slug }) => {
        const isTechnical = slug === 'technical'
        return {
          name: shortDescription,
          href: isTechnical ? DOCS_URL : `/academy/explore?difficulty=${slug}`,
          isExternal: isTechnical,
        }
      }),
      className: 'hidden md:flex',
    },
  ]

  return (
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
          {navData.map(({ title, href, links, className }) => {
            if (href && !links) {
              return (
                <NavigationMenuItem key={href} className={className}>
                  <NavigationMenuLink
                    href={href}
                    className={buttonVariants({ variant: 'ghost' })}
                  >
                    {title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            }

            return (
              <NavigationMenuItem key={title} className={className}>
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
  )
}
