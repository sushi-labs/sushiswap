'use client'

import { Button } from '@sushiswap/ui/components/button'
import { GlobalNav, NavLink, SubNav, SubNavLink } from '@sushiswap/ui/components/GlobalNav'
import Link from 'next/link'
import React, { FC } from 'react'

export const Header: FC = () => {
  return (
    <GlobalNav
      maxWidth="5xl"
      transparent
      className="!relative"
      rightElement={
        <Link href="/swap">
          <Button size="sm" className="ml-4 whitespace-nowrap">
            Enter App
          </Button>
        </Link>
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
