import { ChainId, chainsL2 } from '@sushiswap/chain'
import { useMemo } from 'react'

import { useCurrentBlockTimestamp } from '../../../../hooks'

const L2_DEADLINE_FROM_NOW = 60n * 5n
const TTL = 30n

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
      data = blockTimestamp + L2_DEADLINE_FROM_NOW
    }

    if (blockTimestamp) {
      data = blockTimestamp + TTL * 60n
    }

    return {
      data,
      isLoading,
      isError,
    }
  }, [chainId, currentBlockTimestampQuery, isError, isLoading])
}
