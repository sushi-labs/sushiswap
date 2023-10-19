'use client'

import { createToast } from '@sushiswap/ui/components/toast'
import { SendTransactionResult, waitForTransaction } from '@wagmi/core'
import { useCallback, useMemo, useState } from 'react'
import { Token } from 'sushi/currency'
import {
  Address,
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi'

interface UseTokenRevokeApproval {
  account: Address | undefined
  spender: Address
  token: Token | undefined
}

export const useTokenRevokeApproval = ({
  account,
  spender,
  token,
}: UseTokenRevokeApproval) => {
  const [isPending, setIsPending] = useState(false)
  const { config } = usePrepareContractWrite({
    address: token?.wrapped.address as Address,
    abi: erc20ABI,
    chainId: token?.chainId,
    functionName: 'approve',
    args: [spender, 0n],
    enabled: Boolean(token),
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (account && data && token) {
        const ts = new Date().getTime()
        void createToast({
          account,
          type: 'swap',
          chainId: token.chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Revoking approval for ${token.symbol}`,
            completed: `Successfully revoked approval for ${token.symbol}`,
            failed: `Failed to revoke approval for ${token.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })

        waitForTransaction({ hash: data.hash }).finally(() => {
          setIsPending(false)
        })
      }
    },
    [account, token],
  )

  const write = useContractWrite({
    ...config,
    onSettled,
    onSuccess: () => setIsPending(true),
  })

  return useMemo(() => {
    return {
      ...write,
      isPending,
    }
  }, [isPending, write])
}
