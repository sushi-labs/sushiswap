'use client'

import { useState } from 'react'
import { NetworkFilterSelector } from 'src/ui/common/network-filter-selector'
import type { ChainId } from 'sushi'

//@dev these will come from lp holdings
const PLACEHOLDER_NETWORKS: ChainId[] = [747474, 1, 56, 137, 42161, 8453] // Example networks

export const OpenOrdersNetworkFilter = () => {
  const [networks, setNetworks] = useState<ChainId[]>(PLACEHOLDER_NETWORKS)

  return (
    <NetworkFilterSelector
      selectedNetworks={networks}
      setNetworks={setNetworks}
      defaultNetworks={PLACEHOLDER_NETWORKS}
      className="!bg-[#00000005] dark:!bg-[#00000005]"
    />
  )
}
