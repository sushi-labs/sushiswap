import { BigNumber } from '@ethersproject/bignumber'
import { chainsL2 } from '@sushiswap/chain'
import { useCurrentBlockTimestamp } from '@sushiswap/wagmi'
import { useMemo } from 'react'

import { L2_DEADLINE_FROM_NOW } from '../constants'

const TRANSACTION_DEADLINE = 30

export const useTransactionDeadline = (chainId: number): BigNumber | undefined => {
  const { data: blockTimestamp } = useCurrentBlockTimestamp(chainId)
  return useMemo(() => {
    if (blockTimestamp && chainId && Object.keys(chainsL2).includes(chainId.toString())) {
      return blockTimestamp.add(L2_DEADLINE_FROM_NOW)
    }
    if (blockTimestamp) return blockTimestamp.add(TRANSACTION_DEADLINE * 60)
    return undefined
  }, [blockTimestamp, chainId])
}
