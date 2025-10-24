'use client'
import { useAccount } from 'wagmi'
import { AssetsChart } from '~evm/[chainId]/portfolio/_ui/assets-chart/assets-chart'
import { PortfolioHeader } from '~evm/[chainId]/portfolio/_ui/portfolio-header'
import { TablesView } from '~evm/[chainId]/portfolio/_ui/tables-view/tables-view'
import { WalletHoldings } from '~evm/[chainId]/portfolio/_ui/wallet-holdings/wallet-holdings'
import { ConnnectWallet } from './connect-wallet/connect-wallet'

export const PortfolioPage = () => {
  const { isConnected } = useAccount()

  if (isConnected) {
    return (
      <>
        <PortfolioHeader />
        <AssetsChart />
        <WalletHoldings />
        <TablesView />
      </>
    )
  }

  return <ConnnectWallet />
}
