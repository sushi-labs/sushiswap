import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useCallback, useMemo, useState } from 'react'
import { SendTransactionResult } from '@wagmi/core'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { V3MigrateChainId } from '../types'
import { V3MigrateAddress } from '../constants'
import { V3Migrator } from '../abis/V3Migrator'
import { Amount, Token, Type } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { BigNumber } from 'ethers'

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
    amount0Min: JSBI | undefined
    amount1Min: JSBI | undefined
    recipient: Address | undefined
    deadline: BigNumber | undefined
    refundAsETH: boolean
  }
}

export const V3MigrateContractConfig = (chainId: V3MigrateChainId) => ({
  address: V3MigrateAddress[chainId] as Address,
  abi: V3Migrator,
})

export const useV3Migrate = ({ account, args, chainId, enabled = true }: UseV3Migrate) => {
  const [isPending, setIsPending] = useState(false)
  const { config } = usePrepareContractWrite({
    ...V3MigrateContractConfig(chainId),
    chainId,
    functionName: 'migrate',
    args:
      args.tickUpper &&
      args.tickLower &&
      args.liquidityToMigrate &&
      args.amount0Min &&
      args.amount1Min &&
      args.recipient &&
      args.token0 &&
      args.token1 &&
      args.deadline
        ? [
            {
              pair: args.pair,
              liquidityToMigrate: BigNumber.from(args.liquidityToMigrate.quotient.toString()),
              percentageToMigrate: args.percentageToMigrate,
              token0: args.token0.address as Address,
              token1: args.token1.address as Address,
              fee: args.fee,
              tickLower: args.tickLower,
              tickUpper: args.tickUpper,
              amount0Min: BigNumber.from(args.amount0Min.toString()),
              amount1Min: BigNumber.from(args.amount1Min.toString()),
              recipient: args.recipient,
              deadline: BigNumber.from(args.deadline),
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
        args.tickLower &&
        args.tickUpper &&
        args.deadline
    ),
  })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (account && data) {
        const ts = new Date().getTime()
        void createToast({
          account,
          type: 'swap',
          chainId: chainId,
          txHash: data.hash,
          promise: data.wait(),
          summary: {
            pending: `Migrating your liquidity`,
            completed: `Successfully migrated your liquidity`,
            failed: `Failed to migrate liquidity`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })

        data.wait().finally(() => {
          setIsPending(false)
        })
      }
    },
    [account, chainId]
  )

  const write = useContractWrite({
    ...config,
    onSettled,
    onSuccess: () => setIsPending(true),
  })

  return useMemo(() => {
    return {
      ...write,
      isPending,
    }
  }, [isPending, write])
}
