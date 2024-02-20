'use client'

import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback } from 'react'
import { xsushiAbi } from 'sushi/abi'
import { Amount, Token, XSUSHI_ADDRESS } from 'sushi/currency'
import { UserRejectedRequestError } from 'viem'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { ChainId } from 'sushi/chain'

interface UseBarDepositParams {
  amount?: Amount<Token>
  enabled?: boolean
}

type UseBarDeposit = (
  params: UseBarDepositParams,
) => ReturnType<typeof useContractWrite>

export const useBarDeposit: UseBarDeposit = ({ amount, enabled = true }) => {
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
          type: 'enterBar',
          chainId: ChainId.ETHEREUM,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Staking ${amount.toSignificant(6)} SUSHI`,
            completed: 'Successfully staked SUSHI',
            failed: 'Something went wrong when staking SUSHI',
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
    functionName: 'enter',
    chainId: ChainId.ETHEREUM,
    args: [amount?.quotient],
    enabled,
  })

  return useContractWrite({
    ...config,
    onSettled,
  })
}
