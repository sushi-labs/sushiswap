'use client'

import {
  useSetWalletFilters,
  useWalletFilters,
} from 'src/app/(networks)/(evm)/[chainId]/portfolio/wallet-filters-provider'
import { NetworkFilterSelector } from 'src/app/(networks)/_ui/network-filter-selector'
import { poolChainIds } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio'
import type { ChainId } from 'sushi'

// @dev these will come from api
// const PLACEHOLDER_NETWORKS: ChainId[] = [747474, 1, 137, 42161, 8453]

export const PnlNetworkFilter = () => {
  const { networks } = useWalletFilters()
  const setFilters = useSetWalletFilters()

  const handleSetNetworks = (ids: ChainId[]) => {
    setFilters((prev) => ({ ...prev, networks: ids }))
  }

  return (
    <NetworkFilterSelector
      selectedNetworks={networks}
      setNetworks={handleSetNetworks}
      defaultNetworks={poolChainIds}
      className="!bg-transparent"
    />
  )
}
