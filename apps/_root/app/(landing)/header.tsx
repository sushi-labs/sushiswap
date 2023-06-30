'use client'

import React, { FC } from 'react'
import { GlobalNav, NavLink, SubNav, SubNavLink } from '@sushiswap/ui/components/GlobalNav'
import { Button } from '@sushiswap/ui/components/button'

export const Header: FC = () => {
  return (
    <GlobalNav
      maxWidth="5xl"
      transparent
      className="!relative"
      rightElement={
        <Button asChild size="sm" className="ml-4 whitespace-nowrap">
          <a href="/swap">Enter App</a>
        </Button>
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
