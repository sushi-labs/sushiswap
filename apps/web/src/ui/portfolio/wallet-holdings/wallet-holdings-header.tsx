import { Switch } from '@sushiswap/ui'
import {
  useSetWalletFilters,
  useWalletFilters,
} from 'src/app/(networks)/(evm)/[chainId]/portfolio/wallet-filters-provider'
import { PnlNetworkFilter } from './pnl-network-filter'
import { SendWidget } from './send-widget'

export const WalletHoldingsHeader = () => {
  const { hideSmallPositions, groupByAssets } = useWalletFilters()
  const setFilters = useSetWalletFilters()
  return (
    <>
      <div className="flex gap-4 items-center">
        <div className="flex gap-3 items-center">
          <span className="font-semibold !text-base">Wallet</span>
          <SendWidget />
        </div>
        <div className="flex gap-2 items-center md:hidden">
          <span>Hide &lt; $1</span>
          <Switch
            checked={hideSmallPositions}
            onCheckedChange={() => {
              setFilters((prev) => ({
                ...prev,
                hideSmallPositions: !prev.hideSmallPositions,
              }))
            }}
            className="dark:data-[state=checked]:bg-skyblue"
          />
        </div>
      </div>
      <div className="flex gap-5 text-muted-foreground">
        <div className="hidden gap-2 items-center md:flex">
          <span>Hide &lt; $1</span>
          <Switch
            checked={hideSmallPositions}
            onCheckedChange={() => {
              setFilters((prev) => ({
                ...prev,
                hideSmallPositions: !prev.hideSmallPositions,
              }))
            }}
            className="dark:data-[state=checked]:bg-skyblue"
          />
        </div>
        <div className="flex gap-2 items-center">
          <span>Group By Assets</span>
          <Switch
            checked={groupByAssets}
            onCheckedChange={() => {
              setFilters((prev) => ({
                ...prev,
                groupByAssets: !prev.groupByAssets,
              }))
            }}
            className="dark:data-[state=checked]:bg-skyblue"
          />
        </div>
        <PnlNetworkFilter />
      </div>
    </>
  )
}
