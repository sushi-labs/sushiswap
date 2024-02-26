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

interface UseBarDepositParams {
  amount?: Amount<Token>
  enabled?: boolean
}

type UseBarDeposit = (
  params: UseBarDepositParams,
) => ReturnType<typeof useWriteContract>

export const useBarDeposit: UseBarDeposit = ({ amount, enabled = true }) => {
  const { address } = useAccount()
  const client = usePublicClient<PublicWagmiConfig>()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amount) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'enterBar',
        chainId: ChainId.ETHEREUM,
        txHash: data,
        promise: client.waitForTransactionReceipt({ hash: data }),
        summary: {
          pending: `Staking ${amount.toSignificant(6)} SUSHI`,
          completed: 'Successfully staked SUSHI',
          failed: 'Something went wrong when staking SUSHI',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [amount, address, client],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof UserRejectedRequestError) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const { data } = useSimulateContract({
    address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
    abi: xsushiAbi,
    functionName: 'enter',
    chainId: ChainId.ETHEREUM,
    args: [amount?.quotient],
    query: { enabled },
  })

  return useWriteContract({
    ...data?.request,
    mutation: { onSuccess, onError },
  })
}
