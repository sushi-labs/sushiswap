import { ChainId, chainsL2 } from '@sushiswap/chain'
import { useMemo } from 'react'
import { useCurrentBlockTimestamp } from '../../../../hooks'

const L2_DEADLINE_FROM_NOW = 60 * 5
const TTL = 30

interface UseTransactionDeadline {
  chainId: ChainId
  enabled?: boolean
}

export const useTransactionDeadline = ({ chainId, enabled }: UseTransactionDeadline) => {
  const { data: currentBlockTimestampQuery, isLoading, isError } = useCurrentBlockTimestamp(chainId, enabled)

  return useMemo(() => {
    const blockTimestamp = currentBlockTimestampQuery
    let data = undefined
    if (blockTimestamp && chainId && Object.keys(chainsL2).includes(chainId.toString())) {
      data = blockTimestamp.add(L2_DEADLINE_FROM_NOW)
    }

    if (blockTimestamp) {
      data = blockTimestamp.add(TTL * 60)
    }

    return {
      data,
      isLoading,
      isError,
    }
  }, [chainId, currentBlockTimestampQuery, isError, isLoading])
}
