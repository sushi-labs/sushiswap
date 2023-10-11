'use client'

import { ChainId } from 'sushi/chain'
import { ChefType } from '@sushiswap/client'
import { Amount, SUSHI, SUSHI_ADDRESS, Token } from 'sushi/currency'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData, UserRejectedRequestError } from 'viem'
import {
  Address,
  erc20ABI,
  useAccount,
  useContractReads,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { masterchefV2Abi, minichefV2Abi } from '../../abis'
import {
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MINICHEF_ADDRESS,
  useMasterChefContract,
} from '../useMasterChefContract'
import { UsePrepareSendTransactionConfig } from '../useSendTransaction'

interface UseMasterChefReturn
  extends Pick<ReturnType<typeof useContractReads>, 'isLoading' | 'isError'> {
  balance: Amount<Token> | undefined
  harvest: undefined | (() => void)
  pendingSushi: Amount<Token> | undefined
  isWritePending: boolean
  isWriteError: boolean
}

interface UseMasterChefParams {
  chainId: number
  chef: ChefType
  pid: number
  token: Token
  enabled?: boolean
  watch?: boolean
}

type UseMasterChef = (params: UseMasterChefParams) => UseMasterChefReturn

export const useMasterChef: UseMasterChef = ({
  chainId,
  watch = true,
  chef,
  pid,
  token,
  enabled = true,
}) => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const contract = useMasterChefContract(chainId, chef)

  const contracts = useMemo(() => {
    if (!chainId || !enabled || !address) return []

    if (chainId === ChainId.ETHEREUM) {
      return [
        {
          chainId: ChainId.ETHEREUM,
          address: SUSHI_ADDRESS[chainId] as Address,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [
            (chef === ChefType.MasterChefV1
              ? MASTERCHEF_ADDRESS[chainId]
              : MASTERCHEF_V2_ADDRESS[chainId]) as Address,
          ],
        } as const,
        {
          chainId: ChainId.ETHEREUM,
          address: (chef === ChefType.MasterChefV1
            ? MASTERCHEF_ADDRESS[chainId]
            : MASTERCHEF_V2_ADDRESS[chainId]) as Address,
          abi: [
            chef === ChefType.MasterChefV1
              ? ({
                  inputs: [
                    { internalType: 'uint256', name: '', type: 'uint256' },
                    { internalType: 'address', name: '', type: 'address' },
                  ],
                  name: 'userInfo',
                  outputs: [
                    {
                      internalType: 'uint256',
                      name: 'amount',
                      type: 'uint256',
                    },
                    {
                      internalType: 'uint256',
                      name: 'rewardDebt',
                      type: 'uint256',
                    },
                  ],
                  stateMutability: 'view',
                  type: 'function',
                } as const)
              : ({
                  inputs: [
                    { internalType: 'uint256', name: '', type: 'uint256' },
                    { internalType: 'address', name: '', type: 'address' },
                  ],
                  name: 'userInfo',
                  outputs: [
                    {
                      internalType: 'uint256',
                      name: 'amount',
                      type: 'uint256',
                    },
                    {
                      internalType: 'int256',
                      name: 'rewardDebt',
                      type: 'int256',
                    },
                  ],
                  stateMutability: 'view',
                  type: 'function',
                } as const),
          ] as const,
          functionName: 'userInfo',
          args: [pid, address as Address],
        } as const,
        {
          chainId: ChainId.ETHEREUM,
          address: MASTERCHEF_V2_ADDRESS[chainId] as Address,
          abi: [
            {
              inputs: [
                { internalType: 'uint256', name: '_pid', type: 'uint256' },
                { internalType: 'address', name: '_user', type: 'address' },
              ],
              name: 'pendingSushi',
              outputs: [
                { internalType: 'uint256', name: 'pending', type: 'uint256' },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ] as const,
          functionName: 'pendingSushi',
          args: [pid, address as Address],
        } as const,
      ]
    }

    if (chainId in MINICHEF_ADDRESS && chainId in SUSHI_ADDRESS) {
      return [
        {
          chainId,
          address: SUSHI_ADDRESS[
            chainId as keyof typeof SUSHI_ADDRESS
          ] as Address,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [
            MINICHEF_ADDRESS[
              chainId as keyof typeof MINICHEF_ADDRESS
            ] as Address,
          ],
        } as const,
        {
          chainId,
          address: MINICHEF_ADDRESS[
            chainId as keyof typeof MINICHEF_ADDRESS
          ] as Address,
          abi: [
            {
              inputs: [
                { internalType: 'uint256', name: '', type: 'uint256' },
                { internalType: 'address', name: '', type: 'address' },
              ],
              name: 'userInfo',
              outputs: [
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                { internalType: 'int256', name: 'rewardDebt', type: 'int256' },
              ],
              stateMutability: 'view',
              type: 'function',
            } as const,
          ] as const,
          functionName: 'userInfo',
          args: [pid, address as Address],
        } as const,
      ] as const
    }

    return []
  }, [address, chainId, chef, enabled, pid])

  // Can't type runtime...
  const { data, isLoading, isError } = useContractReads({
    contracts,
    watch,
    keepPreviousData: true,
    enabled: contracts.length > 0 && enabled,
    select: (results) => results.map((r) => r.result),
  })

  const [sushiBalance, balance, pendingSushi] = useMemo(() => {
    const _sushiBalance = data?.[0] ? data?.[0] : undefined
    const _balance = data?.[1] ? (data?.[1] as [bigint, bigint])[0] : undefined

    const _pendingSushi = data?.[2] ? data?.[2] : undefined
    const balance = Amount.fromRawAmount(
      token,
      _balance ? _balance.toString() : 0,
    )
    const pendingSushi = SUSHI[chainId as keyof typeof SUSHI]
      ? Amount.fromRawAmount(
          SUSHI[chainId as keyof typeof SUSHI],
          _pendingSushi ? _pendingSushi.toString() : 0,
        )
      : undefined
    const sushiBalance = SUSHI[chainId as keyof typeof SUSHI]
      ? Amount.fromRawAmount(
          SUSHI[chainId as keyof typeof SUSHI],
          _sushiBalance ? _sushiBalance.toString() : 0,
        )
      : undefined
    return [sushiBalance, balance, pendingSushi]
  }, [chainId, data, token])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (data) {
        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'claimRewards',
          chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: 'Claiming rewards',
            completed: 'Successfully claimed rewards',
            failed: 'Something went wrong when claiming rewards',
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [chainId, address],
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!address || !chainId || !data || !contract) return
    switch (chef) {
      case ChefType.MasterChefV1:
        return {
          account: address,
          to: contract.address,
          data: encodeFunctionData({
            abi: contract.abi,
            functionName: 'deposit',
            args: [BigInt(pid), 0n],
          }),
        }
      case ChefType.MasterChefV2: {
        if (
          pendingSushi &&
          sushiBalance &&
          pendingSushi.greaterThan(sushiBalance)
        ) {
          return {
            account: address,
            to: contract.address,
            data: encodeFunctionData({
              abi: masterchefV2Abi,
              functionName: 'batch',
              args: [
                [
                  encodeFunctionData({
                    abi: masterchefV2Abi,
                    functionName: 'harvestFromMasterChef',
                  }),
                  encodeFunctionData({
                    abi: masterchefV2Abi,
                    functionName: 'harvest',
                    args: [BigInt(pid), address],
                  }),
                ],
                false,
              ],
            }),
          }
        } else {
          return {
            account: address,
            to: contract.address,
            data: encodeFunctionData({
              abi: masterchefV2Abi,
              functionName: 'harvest',
              args: [BigInt(pid), address],
            }),
          }
        }
      }
      default:
        return {
          account: address,
          to: contract.address,
          data: encodeFunctionData({
            abi: minichefV2Abi,
            functionName: 'harvest',
            args: [BigInt(pid), address],
          }),
        }
    }
  }, [address, chainId, chef, contract, data, pendingSushi, pid, sushiBalance])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: chainId === chain?.id,
  })

  const {
    sendTransaction: harvest,
    isLoading: isWritePending,
    isError: isWriteError,
  } = useSendTransaction({
    ...config,
    onSettled,
  })

  return useMemo(() => {
    return {
      harvest,
      balance,
      isLoading,
      isError,
      pendingSushi,
      isWritePending,
      isWriteError,
    }
  }, [
    balance,
    harvest,
    isError,
    isLoading,
    isWriteError,
    isWritePending,
    pendingSushi,
  ])
}
