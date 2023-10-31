'use client'

import { ChefType } from '@sushiswap/client'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback, useMemo } from 'react'
import { masterChefV1Abi, masterChefV2Abi } from 'sushi/abi'
import { Amount, Token } from 'sushi/currency'
import { UserRejectedRequestError, encodeFunctionData } from 'viem'
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { UsePrepareSendTransactionConfig } from '../useSendTransaction'
import { useMasterChefContract } from './use-master-chef-contract'

interface UseMasterChefDepositParams {
  chainId: number
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
  const contract = useMasterChefContract(chainId, chef)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (data && amount) {
        const ts = new Date().getTime()
        createToast({
          account: address,
          type: 'mint',
          chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
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
      }
    },
    [amount, chainId, address],
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

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled,
  })

  return useSendTransaction({
    ...config,
    onSettled,
  })
}
