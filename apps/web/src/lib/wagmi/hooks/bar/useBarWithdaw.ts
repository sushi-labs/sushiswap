'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo } from 'react'
import { logger } from 'src/lib/logger'
import type { Amount } from 'sushi'
import {
  EvmChainId,
  type EvmToken,
  XSUSHI_ADDRESS,
  xsushiAbi_leave,
} from 'sushi/evm'
import { UserRejectedRequestError } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import type { SendTransactionReturnType } from 'wagmi/actions'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface UseBarWithdrawParams {
  amount?: Amount<EvmToken>
  enabled?: boolean
}

export function useBarWithdraw({
  amount,
  enabled = true,
}: UseBarWithdrawParams) {
  const { address } = useAccount()
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amount) return

      const receipt = client.waitForTransactionReceipt({ hash: data })
      receipt.then(() => {
        refetchBalances(EvmChainId.ETHEREUM)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'leaveBar',
        chainId: EvmChainId.ETHEREUM,
        txHash: data,
        promise: receipt,
        summary: {
          pending: `Unstaking ${amount.toSignificant(6)} XSUSHI`,
          completed: 'Successfully unstaked XSUSHI',
          failed: 'Something went wrong when unstaking XSUSHI',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [refetchBalances, address, amount, client],
  )

  const onError = useCallback((e: Error) => {
    if (e.cause instanceof UserRejectedRequestError) {
      return
    }

    logger.error(e, {
      location: 'useBarWithdraw',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const { data: simulation } = useSimulateContract({
    address: XSUSHI_ADDRESS[EvmChainId.ETHEREUM],
    abi: xsushiAbi_leave,
    functionName: 'leave',
    chainId: EvmChainId.ETHEREUM,
    args: amount ? [amount.amount] : undefined,
    query: { enabled },
  })

  const { writeContractAsync, ...rest } = useWriteContract({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return

    return async () => {
      try {
        await writeContractAsync(simulation.request)
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return { ...rest, write }
}
