'use client'

import { GlobalNav, NavLink, SubNav, SubNavLink } from '@sushiswap/ui/components/GlobalNav'

export default function InternalLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GlobalNav>
        <NavLink title="Dashboard" href="/internal" />
        <SubNav title="Bentobox">
          <SubNavLink title="Overview" href="/internal/bentobox" />
          <SubNavLink title="Strategies" href="/internal/bentobox/strategies" />
        </SubNav>
        <NavLink title="Tokens" href="/internal/tokens" />
        <NavLink title="Subgraphs" href="/internal/subgraphs" />
      </GlobalNav>
      <div className="flex items-center justify-center w-full my-10">{children}</div>
    </>
  )
}
