import { App, AppType } from '@sushiswap/ui'
import { NotificationCentre, Wallet } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useNotifications } from 'lib/state/storage'
import { useAccount } from 'wagmi'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)
  return (
    <App.Header
      appType={AppType.Bridge}
      withScrollBackground
      nav={
        <App.NavItemList>
          <App.NavItemInternal href="https://www.sushi.com/swap" label="Swap" />
          <App.NavItemInternal href="https://www.sushi.com/earn" label="Earn" />
          <App.NavItemInternal href="https://www.sushi.com/bridge" label="Bridge" />
        </App.NavItemList>
      }
    >
      <div className="flex items-center gap-2">
        <Wallet.Button
          size="sm"
          className="border-none shadow-md whitespace-nowrap"
          supportedNetworks={SUPPORTED_CHAIN_IDS}
        />
        <NotificationCentre notifications={notifications} clearNotifications={clearNotifications} />
      </div>
    </App.Header>
  )
}
