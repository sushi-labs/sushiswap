import { App, AppType } from '@sushiswap/ui'
import React, { FC } from 'react'

export const Header: FC = () => {
  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItem href="/subgraphs" label="Subgraphs" />
          <App.NavItem href="/tokens" label="Tokens" />
        </App.NavItemList>
      }
    ></App.Header>
  )
}
