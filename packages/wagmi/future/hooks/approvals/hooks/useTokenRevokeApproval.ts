import { useCallback, useMemo, useState } from 'react'
import { Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { Address, erc20ABI, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { SendTransactionResult } from '@wagmi/core'

interface UseTokenRevokeApproval {
  account: Address | undefined
  spender: Address
  token: Token | undefined
}

export const useTokenRevokeApproval = ({ account, spender, token }: UseTokenRevokeApproval) => {
  const [isPending, setIsPending] = useState(false)
  const { config } = usePrepareContractWrite({
    address: token?.wrapped.address as Address,
    abi: erc20ABI,
    chainId: token?.chainId,
    functionName: 'approve',
    args: [spender, BigNumber.from(0)],
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
          promise: data.wait(),
          summary: {
            pending: `Revoking approval for ${token.symbol}`,
            completed: `Successfully revoked approval for ${token.symbol}`,
            failed: `Failed to revoke approval for ${token.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })

        data.wait().finally(() => {
          setIsPending(false)
        })
      }
    },
    [account, token]
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
