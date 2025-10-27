'use client'

import { NetworkFilterSelector } from 'src/app/(networks)/_ui/network-filter-selector'
import type { ChainId } from 'sushi'
import {
  DEFAULT_LP_CHAIN_IDS,
  useLPPositionContext,
} from '~evm/[chainId]/portfolio/lp-position-provider'

export const LPPositionsNetworkFilter = () => {
  const {
    state: { chainIds },
    mutate: { setChainIds },
  } = useLPPositionContext()
  return (
    <NetworkFilterSelector
      selectedNetworks={chainIds as ChainId[]}
      setNetworks={setChainIds as (ids: ChainId[]) => void}
      defaultNetworks={DEFAULT_LP_CHAIN_IDS as ChainId[]}
      className="!bg-[#00000005] dark:!bg-[#00000005]"
    />
  )
}
