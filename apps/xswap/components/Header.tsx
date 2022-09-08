import { App, AppType } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'

export const Header = () => {
  return (
    <App.Header appType={AppType.Swap} withScrollBackground>
      <Wallet.Button size="sm" className="border-none shadow-md whitespace-nowrap" />
    </App.Header>
  )
}
