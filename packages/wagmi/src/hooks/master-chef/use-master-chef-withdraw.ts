'use client'

import { ChefType } from '@sushiswap/client'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useCallback, useMemo } from 'react'
import { ChainId } from 'sushi'
import { masterChefV1Abi, masterChefV2Abi, miniChefV2Abi } from 'sushi/abi'
import { Amount, Token } from 'sushi/currency'
import { UserRejectedRequestError, encodeFunctionData } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSendTransaction,
  useSimulateContract,
} from 'wagmi'
import { SendTransactionReturnType } from 'wagmi/actions'
import { UsePrepareSendTransactionConfig } from '../useSendTransaction'
import { getMasterChefContractConfig } from './use-master-chef-contract'

interface UseMasterChefWithdrawParams {
  chainId: ChainId
  chef: ChefType
  pid: number
  amount?: Amount<Token>
  enabled?: boolean
}

type UseMasterChefWithdraw = (
  params: UseMasterChefWithdrawParams,
) => ReturnType<typeof useSendTransaction>

export const useMasterChefWithdraw: UseMasterChefWithdraw = ({
  chainId,
  amount,
  chef,
  pid,
  enabled = true,
}) => {
  const { address } = useAccount()
  const client = usePublicClient<PublicWagmiConfig>()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!amount) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'burn',
        chainId,
        txHash: data,
        promise: client.waitForTransactionReceipt({ hash: data }),
        summary: {
          pending: `Unstaking ${amount.toSignificant(6)} ${
            amount.currency.symbol
          } tokens`,
          completed: `Successfully unstaked ${amount.toSignificant(6)} ${
            amount.currency.symbol
          } tokens`,
          failed: `Something went wrong when unstaking ${amount.currency.symbol} tokens`,
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [amount, client, chainId, address],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof UserRejectedRequestError) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!address || !chainId || !amount || !chef) return

    if (getMasterChefContractConfig(chainId, chef)?.address) {
      let data
      switch (chef) {
        case ChefType.MasterChefV1:
          data = encodeFunctionData({
            abi: masterChefV1Abi,
            functionName: 'withdraw',
            args: [BigInt(pid), BigInt(amount.quotient.toString())],
          })
          break
        case ChefType.MasterChefV2:
          data = encodeFunctionData({
            abi: masterChefV2Abi,
            functionName: 'withdraw',
            args: [BigInt(pid), BigInt(amount.quotient.toString()), address],
          })
          break
        case ChefType.MiniChef:
          data = encodeFunctionData({
            abi: miniChefV2Abi,
            functionName: 'withdrawAndHarvest',
            args: [BigInt(pid), BigInt(amount.quotient.toString()), address],
          })
      }

      return {
        from: address,
        to: getMasterChefContractConfig(chainId, chef)?.address,
        data,
      }
    }
  }, [address, amount, chainId, chef, pid])

  const { data: simulation } = useSimulateContract({
    ...prepare,
    chainId,
    enabled,
  })

  return useSendTransaction({
    ...simulation?.request,
    mutation: {
      onError,
      onSuccess,
    },
  })
}
