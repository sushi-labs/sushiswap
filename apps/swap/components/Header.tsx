import { App } from '@sushiswap/ui'
import { AppType } from '@sushiswap/ui/app/Header'
import { Wallet } from '@sushiswap/wagmi'

export const Header = () => {
  return (
    <App.Header appType={AppType.Swap} withScrollBackground>
      <Wallet.Button size="sm" className="border-none shadow-md whitespace-nowrap" />
    </App.Header>
  )
}
