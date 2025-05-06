import { getDifficulties } from '@sushiswap/graph-client/strapi'
import {
  Navigation,
  type NavigationElement,
  NavigationElementType,
} from '@sushiswap/ui'
import React from 'react'
import { EXPLORE_NAVIGATION_LINKS } from '../_common/header-elements'
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

export async function Header() {
  const difficulties = await getDifficulties()

  const navData: NavigationElement[] = [
    {
      title: 'Explore',
      items: EXPLORE_NAVIGATION_LINKS(),
      show: 'everywhere',
      type: NavigationElementType.Dropdown,
    },
    {
      title: 'Academy',
      href: '/academy',
      show: 'everywhere',
      type: NavigationElementType.Single,
    },
    {
      title: 'Blog',
      href: '/blog',
      show: 'everywhere',
      type: NavigationElementType.Single,
    },
    {
      title: 'FAQ',
      href: '/faq',
      show: 'everywhere',
      type: NavigationElementType.Single,
    },
    {
      title: 'Learn',
      items: difficulties?.map(({ shortDescription, slug }) => {
        const isTechnical = slug === 'technical'
        return {
          title: shortDescription,
          href: isTechnical ? DOCS_URL : `/academy/explore?difficulty=${slug}`,
          description: '',
        }
      }),
      show: 'desktop',
      type: NavigationElementType.Dropdown,
    },
  ]

  return <Navigation leftElements={navData} />
}
