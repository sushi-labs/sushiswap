'use client'

import { ChefType } from '@sushiswap/client'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback, useMemo } from 'react'
import { masterChefV1Abi, masterChefV2Abi } from 'sushi/abi'
import { Amount, Token } from 'sushi/currency'
import { UserRejectedRequestError, encodeFunctionData } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSendTransaction,
  useSimulateContract,
} from 'wagmi'
import { SendTransactionReturnType } from 'wagmi/actions'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { ChainId } from 'sushi'
import { UsePrepareSendTransactionConfig } from '../useSendTransaction'
import { useMasterChefContract } from './use-master-chef-contract'

interface UseMasterChefDepositParams {
  chainId: ChainId
  chef: ChefType
  pid: number
  amount?: Amount<Token>
  enabled?: boolean
}

type UseMasterChefDeposit = (
  params: UseMasterChefDepositParams,
) => ReturnType<typeof useSendTransaction>

export const useMasterChefDeposit: UseMasterChefDeposit = ({
  chainId,
  amount,
  chef,
  pid,
  enabled = true,
}) => {
  const { address } = useAccount()
  const client = usePublicClient<PublicWagmiConfig>()
  const contract = useMasterChefContract(chainId, chef)

  const onError = useCallback((e: Error) => {
    if (e instanceof UserRejectedRequestError) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amount) return

      try {
        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'mint',
          chainId,
          txHash: data,
          promise: client.waitForTransactionReceipt({ hash: data }),
          summary: {
            pending: `Staking ${amount.toSignificant(6)} ${
              amount.currency.symbol
            } tokens`,
            completed: `Successfully staked ${amount.toSignificant(6)} ${
              amount.currency.symbol
            } tokens`,
            failed: `Something went wrong when staking ${amount.currency.symbol} tokens`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      } catch {}
    },
    [address, chainId, client, amount],
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!address || !chainId || !amount || !contract) return

    let data
    if (chef === ChefType.MasterChefV1) {
      data = encodeFunctionData({
        abi: masterChefV1Abi,
        functionName: 'deposit',
        args: [BigInt(pid), BigInt(amount.quotient.toString())],
      })
    } else {
      data = encodeFunctionData({
        abi: masterChefV2Abi,
        functionName: 'deposit',
        args: [BigInt(pid), BigInt(amount.quotient.toString()), address],
      })
    }

    return {
      account: address,
      to: contract.address,
      data,
    }
  }, [address, amount, chainId, chef, contract, pid])

  const { data: simulation } = useSimulateContract({
    ...prepare,
    chainId,
    enabled,
  })

  return useSendTransaction({
    ...simulation?.request,
    mutation: {
      onSuccess,
      onError,
    },
  })
}
