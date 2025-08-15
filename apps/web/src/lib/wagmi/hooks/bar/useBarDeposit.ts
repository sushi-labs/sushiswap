'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useCallback, useMemo } from 'react'
import type { Amount } from 'sushi'
import {
  EvmChainId,
  type EvmToken,
  XSUSHI_ADDRESS,
  xsushiAbi_enter,
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

interface UseBarDepositParams {
  amount?: Amount<EvmToken>
  enabled?: boolean
}

export function useBarDeposit({ amount, enabled = true }: UseBarDepositParams) {
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
        type: 'enterBar',
        chainId: EvmChainId.ETHEREUM,
        txHash: data,
        promise: receipt,
        summary: {
          pending: `Staking ${amount.toSignificant(6)} SUSHI`,
          completed: 'Successfully staked SUSHI',
          failed: 'Something went wrong when staking SUSHI',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [refetchBalances, amount, address, client],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const { data: simulation } = useSimulateContract({
    address: XSUSHI_ADDRESS[EvmChainId.ETHEREUM],
    abi: xsushiAbi_enter,
    functionName: 'enter',
    chainId: EvmChainId.ETHEREUM,
    args: amount ? [amount.amount] : undefined,
    query: { enabled },
  })

  const { writeContractAsync, ...rest } = useWriteContract({
    mutation: { onSuccess, onError },
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return undefined

    return async () => {
      try {
        await writeContractAsync(simulation.request)
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return { ...rest, write }
}
