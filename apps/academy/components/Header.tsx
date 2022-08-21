import { App } from '@sushiswap/ui'
import { AppType } from '@sushiswap/ui/app/Header'
import { FC } from 'react'

export const Header: FC = () => (
  <App.Header appType={AppType.Blog} className="border-b bg-slate-900 border-slate-200/5" maxWidth="5xl">
    {/** TODO: implement */}
    <nav className="flex gap-14">
      <div>About</div>
      <div>Products</div>
      <div>Resources</div>
    </nav>
  </App.Header>
)
