'use client'

import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback } from 'react'
import { xsushiAbi } from 'sushi/abi'
import { Amount, Token, XSUSHI_ADDRESS } from 'sushi/currency'
import { UserRejectedRequestError } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import { SendTransactionReturnType } from 'wagmi/actions'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { ChainId } from 'sushi/chain'

interface UseBarWithdrawParams {
  amount?: Amount<Token>
  enabled?: boolean
}

type useBarWithdraw = (
  params: UseBarWithdrawParams,
) => ReturnType<typeof useWriteContract>

export const useBarWithdraw: useBarWithdraw = ({ amount, enabled = true }) => {
  const { address } = useAccount()
  const client = usePublicClient<PublicWagmiConfig>()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amount) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'leaveBar',
        chainId: ChainId.ETHEREUM,
        txHash: data,
        promise: client.waitForTransactionReceipt({ hash: data }),
        summary: {
          pending: `Unstaking ${amount.toSignificant(6)} XSUSHI`,
          completed: 'Successfully unstaked XSUSHI',
          failed: 'Something went wrong when unstaking XSUSHI',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [address, amount, client],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof UserRejectedRequestError) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const { data } = useSimulateContract({
    address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
    abi: xsushiAbi,
    functionName: 'leave',
    chainId: ChainId.ETHEREUM,
    args: [amount?.quotient],
    query: { enabled },
  })

  return useWriteContract({
    ...data?.request,
    mutation: {
      onSuccess,
      onError,
    },
  })
}
