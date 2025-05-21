import { TotalBalance } from './total-balance'
import { WalletAssets } from './wallet-assets'

export const PortfolioAssets = () => {
  return (
    <div className="flex flex-col gap-y-5 h-full overflow-y-auto">
      <div className="px-5">
        <TotalBalance />
      </div>
      <div className="flex flex-col gap-y-5 px-4">
        <WalletAssets />
      </div>
    </div>
  )
}
