import { App, AppType } from '@sushiswap/ui'
import { FC } from 'react'

export const Header: FC = () => {
  return (
    <App.Header appType={AppType.Blog} className="border-b bg-slate-900 border-slate-200/5" nav={<></>}>
      <div className="flex items-center gap-9 whitespace-nowrap"></div>
    </App.Header>
  )
}
