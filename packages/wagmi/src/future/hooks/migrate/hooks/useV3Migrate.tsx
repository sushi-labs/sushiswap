import { Amount, Token, Type } from '@sushiswap/currency'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { SendTransactionResult, waitForTransaction } from '@wagmi/core'
import { useCallback } from 'react'
import { encodeFunctionData, UserRejectedRequestError } from 'viem'
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi'

import { V3Migrator } from '../abis/V3Migrator'
import { V3MigrateAddress } from '../constants'
import { V3MigrateChainId } from '../types'

interface UseV3Migrate {
  chainId: V3MigrateChainId
  account: Address | undefined
  enabled?: boolean
  args: {
    pair: Address
    liquidityToMigrate: Amount<Type> | null | undefined
    percentageToMigrate: number
    token0: Token | undefined
    token1: Token | undefined
    fee: FeeAmount
    tickLower: number | undefined
    tickUpper: number | undefined
    amount0Min: bigint | undefined
    amount1Min: bigint | undefined
    recipient: Address | undefined
    deadline: bigint | undefined
    refundAsETH: boolean
    noLiquidity: boolean | undefined
    sqrtPrice: bigint | undefined
  }
}

export const V3MigrateContractConfig = (chainId: V3MigrateChainId) => ({
  address: V3MigrateAddress[chainId] as Address,
  abi: V3Migrator,
})

export const useV3Migrate = ({ account, args, chainId, enabled = true }: UseV3Migrate) => {
  const { config } = usePrepareContractWrite(
    args.noLiquidity
      ? {
          ...V3MigrateContractConfig(chainId),
          chainId,
          functionName: 'multicall',
          args:
            typeof args.tickLower === 'number' &&
            typeof args.tickUpper === 'number' &&
            args.liquidityToMigrate &&
            args.amount0Min &&
            args.amount1Min &&
            args.recipient &&
            args.token0 &&
            args.token1 &&
            args.deadline &&
            args.sqrtPrice
              ? ([
                  [
                    encodeFunctionData({
                      abi: V3Migrator,
                      functionName: 'createAndInitializePoolIfNecessary',
                      args: [args.token0.address as Address, args.token1.address as Address, args.fee, args.sqrtPrice],
                    }),
                    encodeFunctionData({
                      abi: V3Migrator,
                      functionName: 'migrate',
                      args: [
                        {
                          pair: args.pair,
                          liquidityToMigrate: args.liquidityToMigrate.quotient,
                          percentageToMigrate: args.percentageToMigrate,
                          token0: args.token0.address as Address,
                          token1: args.token1.address as Address,
                          fee: args.fee,
                          tickLower: args.tickLower,
                          tickUpper: args.tickUpper,
                          amount0Min: args.amount0Min,
                          amount1Min: args.amount1Min,
                          recipient: args.recipient,
                          deadline: args.deadline,
                          refundAsETH: args.refundAsETH,
                        },
                      ],
                    }),
                  ],
                ] as readonly [readonly `0x${string}`[]])
              : undefined,
          enabled: Boolean(
            chainId &&
              enabled &&
              args.liquidityToMigrate &&
              args.amount1Min &&
              args.amount0Min &&
              args.token0 &&
              args.token1 &&
              typeof args.tickLower === 'number' &&
              typeof args.tickUpper === 'number' &&
              args.deadline
          ),
        }
      : {
          ...V3MigrateContractConfig(chainId),
          chainId,
          functionName: 'migrate',
          args:
            typeof args.tickLower === 'number' &&
            typeof args.tickUpper === 'number' &&
            args.liquidityToMigrate &&
            args.amount0Min &&
            args.amount1Min &&
            args.recipient &&
            args.token0 &&
            args.token1 &&
            args.deadline &&
            args.sqrtPrice
              ? [
                  {
                    pair: args.pair,
                    liquidityToMigrate: args.liquidityToMigrate.quotient,
                    percentageToMigrate: args.percentageToMigrate,
                    token0: args.token0.address as Address,
                    token1: args.token1.address as Address,
                    fee: args.fee,
                    tickLower: args.tickLower,
                    tickUpper: args.tickUpper,
                    amount0Min: args.amount0Min,
                    amount1Min: args.amount1Min,
                    recipient: args.recipient,
                    deadline: args.deadline,
                    refundAsETH: args.refundAsETH,
                  },
                ]
              : undefined,
          enabled: Boolean(
            chainId &&
              enabled &&
              args.liquidityToMigrate &&
              args.amount1Min &&
              args.amount0Min &&
              args.token0 &&
              args.token1 &&
              typeof args.tickLower === 'number' &&
              typeof args.tickUpper === 'number' &&
              args.deadline
          ),
        }
  )

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, e: Error | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          createErrorToast(e.message, true)
        }
      }

      if (account && data) {
        const ts = new Date().getTime()
        void createToast({
          account,
          type: 'swap',
          chainId: chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: 'Migrating your liquidity',
            completed: 'Successfully migrated your liquidity',
            failed: 'Failed to migrate liquidity',
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      }
    },
    [account, chainId]
  )

  return useContractWrite({
    ...config,
    onSettled,
  })
}
