import { Auction } from 'app/features/miso/context/Auction'
import { MISO } from 'app/services/graph/fetchers/miso'
import {
  AuctionFetchState,
  useContractCallMisoCommitments,
  useSubgraphMisoCommitments,
} from 'app/services/graph/hooks/miso'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

export const useAuctionCommitments = (auction: Auction): AuctionFetchState => {
  const { chainId } = useActiveWeb3React()

  // If we have a name for a subgraph, we assume there is one.
  // This is our "shouldFetch" for the subgraph hook.
  const useSubgraph = Boolean(chainId && chainId in MISO)
  const subgraphResult = useSubgraphMisoCommitments({
    chainId,
    variables: { where: { auction: auction.auctionInfo.addr.toLowerCase() } },
    shouldFetch: useSubgraph,
    auction,
  })

  // We check if subgraph should not have fetched, or that it fetched and errored, if either we useContract.
  // This is our "shouldFetch" for contract hook.
  const useContract = !useSubgraph || (useSubgraph && subgraphResult.error)
  const contractResult = useContractCallMisoCommitments({ auction, shouldFetch: useContract })

  return useMemo(() => (useContract ? contractResult : subgraphResult), [contractResult, subgraphResult, useContract])
}
