import { defaultAbiCoder } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { Listener, Web3Provider } from '@ethersproject/providers'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import { Auction } from 'app/features/miso/context/Auction'
import { TOPIC_ADDED_COMMITMENT } from 'app/features/miso/context/constants'
import { AuctionCommitment } from 'app/features/miso/context/types'
import { MisoAbiByTemplateId } from 'app/features/miso/context/utils'
import { useContract } from 'app/hooks'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { getMisoCommitments } from 'app/services/graph/fetchers/miso'
import { useActiveWeb3React } from 'app/services/web3'
import stringify from 'fast-json-stable-stringify'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export interface AuctionFetchState {
  commitments: AuctionCommitment[]
  loading: boolean
  error: boolean
}

interface MisoCommitmentGqlData {
  id: string
  user: {
    id: string
  }
  amount: string
  block: string
  transactionHash: string
}

const misoSubgraphFormatter = (rawData: MisoCommitmentGqlData[], auction: Auction): AuctionCommitment[] => {
  return rawData.map((i) => ({
    txHash: i.transactionHash,
    blockNumber: parseInt(i.block),
    address: i.user.id,
    amount: CurrencyAmount.fromRawAmount(auction.paymentToken, i.amount),
  }))
}

interface MisoCommitmentProps {
  chainId?: number
  variables?: { [key: string]: any }
  auction: Auction
  shouldFetch?: boolean
}

export const useSubgraphMisoCommitments = ({
  chainId,
  variables,
  // TODO: Subgraph should provide all the data needed, but looks like payment token was missing?
  auction,
  shouldFetch = true,
}: MisoCommitmentProps): AuctionFetchState => {
  const { data, error, isValidating } = useSWR<{ commitments: MisoCommitmentGqlData[] }>(
    shouldFetch ? ['misCommitments', stringify(variables)] : null,
    () => getMisoCommitments(chainId, variables)
  )
  return useMemo(
    () => ({ commitments: misoSubgraphFormatter(data?.commitments ?? [], auction), error, loading: isValidating }),
    [auction, data?.commitments, error, isValidating]
  )
}

interface MisoContractCallProps {
  auction: Auction
  shouldFetch: boolean
}

const getAuctionCommitments = async (
  library: Web3Provider,
  blockNumber: number,
  auction: Auction
): Promise<AuctionCommitment[]> => {
  const logs = await library.getLogs({
    fromBlock: blockNumber - 1023,
    toBlock: blockNumber,
    address: auction.auctionInfo.addr,
    topics: [TOPIC_ADDED_COMMITMENT],
  })

  return logs.map(({ data, transactionHash, blockNumber }) => {
    const [address, amount] = defaultAbiCoder.decode(['address', 'uint256'], data)
    return {
      txHash: transactionHash,
      blockNumber: blockNumber,
      address,
      amount: CurrencyAmount.fromRawAmount(auction.paymentToken, amount),
    }
  })
}

function subscribeToIncomingCommitments(
  contract: Contract,
  auction: Auction,
  setCommitments: Dispatch<SetStateAction<AuctionCommitment[]>>
) {
  const handler: Listener = (_, __, result) => {
    if (result) {
      const [address, amount] = defaultAbiCoder.decode(['address', 'uint256'], result.data)
      setCommitments((prevState) => {
        if (!prevState.find((el) => el.txHash === result.transactionHash)) {
          return [
            {
              txHash: result.transactionHash,
              blockNumber: result.blockNumber,
              address,
              amount: CurrencyAmount.fromRawAmount(auction.paymentToken, amount),
            },
            ...prevState,
          ]
        } else return prevState
      })
    }
  }

  // Subscribe
  contract.on({ address: auction.auctionToken.address, topics: [TOPIC_ADDED_COMMITMENT] }, handler)

  // Unsubscribe
  return () => {
    contract.off({ address: auction.auctionToken.address, topics: [TOPIC_ADDED_COMMITMENT] }, handler)
  }
}

export const useContractCallMisoCommitments = ({ auction, shouldFetch }: MisoContractCallProps): AuctionFetchState => {
  const { library, chainId } = useActiveWeb3React()

  const blockNumber = useBlockNumber()
  const contract = useContract(
    auction.auctionInfo.addr,
    chainId ? MisoAbiByTemplateId(chainId, auction.template) : undefined
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [commitments, setCommitments] = useState<AuctionCommitment[]>([])

  /* Get historical commitments */
  useEffect(() => {
    if (!library || !contract || commitments.length > 0 || !blockNumber || !shouldFetch) return
    ;(async () => {
      try {
        setLoading(true)
        setError(false)
        const result = await getAuctionCommitments(library, blockNumber, auction)
        setLoading(false)
        setCommitments(result)
      } catch (e) {
        console.error(e)
        setLoading(false)
        setError(true)
      }
    })()
  }, [auction, blockNumber, commitments.length, contract, library, shouldFetch])

  /* Get new commitments realtime */
  useEffect(() => {
    if (!contract) return
    return subscribeToIncomingCommitments(contract, auction, setCommitments)
  }, [auction, contract])

  return { commitments, loading, error }
}
