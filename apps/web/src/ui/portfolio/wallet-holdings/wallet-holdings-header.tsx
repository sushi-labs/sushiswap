import { Switch } from '@sushiswap/ui'
import { PnlNetworkFilter } from './pnl-network-filter'
import { SendWidget } from './send-widget'

export const WalletHoldingsHeader = () => {
  return (
    <>
      <div className="flex gap-4 items-center">
        <div className="flex gap-3 items-center">
          <span className="font-semibold !text-base">Wallet</span>
          <SendWidget />
        </div>
        <div className="flex gap-2 items-center md:hidden">
          <span>Hide &lt; $1</span>
          <Switch className="dark:data-[state=checked]:bg-skyblue" />
        </div>
      </div>
      <div className="flex gap-5 text-muted-foreground">
        <div className="hidden gap-2 items-center md:flex">
          <span>Hide &lt; $1</span>
          <Switch className="dark:data-[state=checked]:bg-skyblue" />
        </div>
        <div className="flex gap-2 items-center">
          <span>Group By Assets</span>
          <Switch className="dark:data-[state=checked]:bg-skyblue" />
        </div>
        <PnlNetworkFilter />
      </div>
    </>
  )
}
