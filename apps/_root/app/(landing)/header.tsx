'use client'

import React, { FC } from 'react'
import { GlobalNav, NavLink, SubNav, SubNavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { Button } from '@sushiswap/ui/future/components/button'
import Link from 'next/link'

export const Header: FC = () => {
  return (
    <GlobalNav
      maxWidth="5xl"
      transparent
      className="!relative"
      rightElement={
        <Link href="/swap" prefetch>
          <Button as="span" size="sm" className="ml-4 whitespace-nowrap">
            Enter App
          </Button>
        </Link>

        //   // <Link.Internal href="/swap" passHref={true}>
        //   //   <Button as="a" size="sm" className="ml-4 whitespace-nowrap">
        //   //     Enter App
        //   //   </Button>
        //   // </Link.Internal>
      }
    >
      <NavLink title="Blog" href="https://www.sushi.com/blog" />
      <SubNav title="Governance">
        <SubNavLink href="https://forum.sushi.com" title="Forum & Proposals" />
        <SubNavLink href="https://snapshot.org/#/sushigov.eth" title="Vote" />
      </SubNav>
    </GlobalNav>
  )
}
