'use client'

import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback } from 'react'
import { xsushiAbi } from 'sushi/abi'
import { Amount, Token, XSUSHI_ADDRESS } from 'sushi/currency'
import { UserRejectedRequestError } from 'viem'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { ChainId } from 'sushi/chain'

interface UseBarWithdrawParams {
  amount?: Amount<Token>
  enabled?: boolean
}

type useBarWithdraw = (
  params: UseBarWithdrawParams,
) => ReturnType<typeof useContractWrite>

export const useBarWithdraw: useBarWithdraw = ({ amount, enabled = true }) => {
  const { address } = useAccount()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (data && amount) {
        const ts = new Date().getTime()
        createToast({
          account: address,
          type: 'leaveBar',
          chainId: ChainId.ETHEREUM,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Unstaking ${amount.toSignificant(6)} XSUSHI`,
            completed: 'Successfully unstaked XSUSHI',
            failed: 'Something went wrong when unstaking XSUSHI',
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [amount, address],
  )

  const { config } = usePrepareContractWrite({
    address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
    abi: xsushiAbi,
    functionName: 'leave',
    chainId: ChainId.ETHEREUM,
    args: [amount?.quotient],
    enabled,
  })

  return useContractWrite({
    ...config,
    onSettled,
  })
}
