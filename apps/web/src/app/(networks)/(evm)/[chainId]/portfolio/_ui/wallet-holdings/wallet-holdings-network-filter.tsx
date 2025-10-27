'use client'

import { useState } from 'react'
import { NetworkFilterSelector } from 'src/app/(networks)/_ui/network-filter-selector'
import type { ChainId } from 'sushi'
import { PoolChainIds } from '../../wallet-filters-provider'

export const WalletHoldingsNetworkFilter = () => {
  const [networks, setNetworks] = useState<ChainId[]>(PoolChainIds)

  return (
    <NetworkFilterSelector
      selectedNetworks={networks}
      setNetworks={setNetworks}
      defaultNetworks={PoolChainIds}
      className="!bg-[#00000005] dark:!bg-[#00000005]"
    />
  )
}
