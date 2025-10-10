'use client'

import { useState } from 'react'
import { NetworkFilterSelector } from 'src/app/(networks)/_ui/network-filter-selector'
import { poolChainIds } from 'src/lib/wagmi/hooks/portfolio/use-wallet-portfolio'
import type { ChainId } from 'sushi'

export const LPPositionsNetworkFilter = () => {
  const [networks, setNetworks] = useState<ChainId[]>(poolChainIds)

  return (
    <NetworkFilterSelector
      selectedNetworks={networks}
      setNetworks={setNetworks}
      defaultNetworks={poolChainIds}
      className="!bg-[#00000005] dark:!bg-[#00000005]"
    />
  )
}
