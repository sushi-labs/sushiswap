import { App, AppType } from '@sushiswap/ui'
import React, { FC } from 'react'

export const Header: FC = () => {
  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItemInternal href="/subgraphs" label="Subgraphs" />
          <App.NavItemInternal href="/tokens" label="Tokens" />
        </App.NavItemList>
      }
    ></App.Header>
  )
}
