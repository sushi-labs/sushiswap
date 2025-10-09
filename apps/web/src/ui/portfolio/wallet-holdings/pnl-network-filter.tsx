'use client'

import {
  PLACEHOLDER_NETWORKS,
  useSetWalletFilters,
  useWalletFilters,
} from 'src/app/(networks)/(evm)/[chainId]/portfolio/wallet-filters-provider'
import { NetworkFilterSelector } from 'src/app/(networks)/_ui/network-filter-selector'
import type { ChainId } from 'sushi'

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
      defaultNetworks={PLACEHOLDER_NETWORKS}
      className="!bg-transparent"
    />
  )
}
