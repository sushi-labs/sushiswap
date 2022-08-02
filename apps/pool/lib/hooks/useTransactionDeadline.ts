import { chainsL2 } from '@sushiswap/chain'
import { useCurrentBlockTimestamp } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { L2_DEADLINE_FROM_NOW } from '../constants'
import { useSettings } from '../state/storage'

export const useTransactionDeadline = () => {
  const { chain } = useNetwork()
  const { data: blockTimestamp } = useCurrentBlockTimestamp(chain?.id)
  const [{ transactionDeadline: ttl }] = useSettings()

  return useMemo(() => {
    if (blockTimestamp && chain?.id && Object.keys(chainsL2).includes(chain.id.toString())) {
      return blockTimestamp.add(L2_DEADLINE_FROM_NOW)
    }

    if (blockTimestamp && ttl) return blockTimestamp.add(ttl * 60)
    return undefined
  }, [blockTimestamp, chain?.id, ttl])
}
