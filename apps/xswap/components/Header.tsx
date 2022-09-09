import { App, AppType } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'

export const Header = () => {
  return (
    <App.Header appType={AppType.Swap} withScrollBackground>
      <Wallet.Button
        size="sm"
        className="border-none shadow-md whitespace-nowrap"
        supportedNetworks={SUPPORTED_CHAIN_IDS}
      />
    </App.Header>
  )
}
