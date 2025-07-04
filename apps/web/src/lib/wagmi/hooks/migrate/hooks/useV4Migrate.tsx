import { createErrorToast, createToast } from '@sushiswap/notifications'
import type { SendTransactionReturnType } from '@wagmi/core'
import { useCallback, useMemo } from 'react'
import {
  type PoolKey,
  encodePoolKey,
  encodePoolParameters,
} from 'src/lib/pool/v4'
import { SUSHISWAP_V3_POSITION_MANAGER } from 'sushi/config'
import type { Amount, Type } from 'sushi/currency'
import { SushiSwapProtocol } from 'sushi/types'
import {
  type Address,
  type ContractFunctionArgs,
  type Hex,
  UserRejectedRequestError,
  encodeFunctionData,
  zeroAddress,
} from 'viem'
import {
  type UseSimulateContractParameters,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { V4Migrator } from '../abis/V4Migrator'
import { V4MigrateAddress } from '../constants'
import type { V4MigrateChainId } from '../types'

interface BaseMigrateArgs {
  poolKey: PoolKey | undefined
  tickLower: number | undefined
  tickUpper: number | undefined
  amount0Min: bigint | undefined
  amount1Min: bigint | undefined
  liquidityMin: bigint | undefined
  deadline: bigint | undefined
  recipient: Address | undefined
  noLiquidity: boolean | undefined
  sqrtPrice: bigint | undefined
  hookData: Hex | undefined
}

interface V2MigrateArgs extends BaseMigrateArgs {
  protocol: typeof SushiSwapProtocol.SUSHISWAP_V2
  pair: Address
  liquidityToMigrate: Amount<Type> | null | undefined
  percentageToMigrate: number
  refundAsETH: boolean
}

interface V3MigrateArgs extends BaseMigrateArgs {
  protocol: typeof SushiSwapProtocol.SUSHISWAP_V3
  tokenId: bigint
  liquidityToMigrate: bigint | null | undefined
  collectFee: boolean
}

interface UseV4Migrate {
  chainId: V4MigrateChainId
  account: Address | undefined
  enabled?: boolean
  args: V2MigrateArgs | V3MigrateArgs
}

export const V4MigrateContractConfig = (chainId: V4MigrateChainId) => ({
  address: V4MigrateAddress[chainId] as Address,
  abi: V4Migrator,
})

export const useV4Migrate = ({
  account,
  args,
  chainId,
  enabled = true,
}: UseV4Migrate) => {
  const client = usePublicClient()

  const { multicall: multicallContract, migrate: migrateContract } =
    useMemo(() => {
      if (
        typeof args.tickLower !== 'number' ||
        typeof args.tickUpper !== 'number' ||
        !args.poolKey ||
        !args.liquidityToMigrate ||
        !args.amount0Min ||
        !args.amount1Min ||
        !args.recipient ||
        !args.deadline ||
        !args.sqrtPrice ||
        !args.liquidityMin ||
        !args.hookData
      ) {
        return { multicall: null, migrate: null }
      }

      const txArgs =
        args.protocol === SushiSwapProtocol.SUSHISWAP_V3
          ? ([
              {
                nfp: SUSHISWAP_V3_POSITION_MANAGER[chainId],
                tokenId: args.tokenId,
                liquidity: args.liquidityToMigrate,
                amount0Min: args.amount0Min,
                amount1Min: args.amount1Min,
                collectFee: args.collectFee,
                deadline: args.deadline,
              },
              {
                poolKey: encodePoolKey(args.poolKey),
                tickLower: args.tickLower,
                tickUpper: args.tickUpper,
                liquidityMin: args.liquidityMin,
                recipient: args.recipient,
                deadline: args.deadline,
                hookData: args.hookData,
              },
              0n,
              0n,
            ] as const satisfies ContractFunctionArgs<
              typeof V4Migrator,
              'payable',
              'migrateFromV3'
            >)
          : ([
              {
                pair: args.pair,
                migrateAmount: args.liquidityToMigrate.quotient,
                amount0Min: args.amount0Min,
                amount1Min: args.amount1Min,
              },
              {
                poolKey: encodePoolKey(args.poolKey),
                tickLower: args.tickLower,
                tickUpper: args.tickUpper,
                liquidityMin: args.liquidityMin,
                recipient: args.recipient,
                deadline: args.deadline,
                hookData: args.hookData,
              },
              0n,
              0n,
            ] as const satisfies ContractFunctionArgs<
              typeof V4Migrator,
              'payable',
              'migrateFromV2'
            >)

      const functionName =
        args.protocol === SushiSwapProtocol.SUSHISWAP_V3
          ? 'migrateFromV3'
          : 'migrateFromV2'

      if (args.noLiquidity) {
        return {
          migrate: null,
          multicall: {
            ...V4MigrateContractConfig(chainId),
            chainId,
            functionName: 'multicall',
            args: [
              [
                encodeFunctionData({
                  abi: V4Migrator,
                  functionName: 'initializePool',
                  args: [
                    {
                      currency0: args.poolKey.currency0,
                      currency1: args.poolKey.currency1,
                      hooks: args.poolKey.hooks ?? zeroAddress,
                      poolManager: args.poolKey.poolManager,
                      fee: args.poolKey.fee,
                      parameters: encodePoolParameters(args.poolKey.parameters),
                    },
                    args.sqrtPrice,
                  ],
                }),
                encodeFunctionData({
                  abi: V4Migrator,
                  functionName,
                  args: txArgs,
                }),
              ],
            ] as readonly [readonly `0x${string}`[]],
          } as const,
        }
      }

      return {
        multicall: null,
        migrate: {
          ...V4MigrateContractConfig(chainId),
          chainId,
          functionName,
          args: txArgs,
        } as const satisfies UseSimulateContractParameters,
      }
    }, [args, chainId])

  const { data: migrateSimulation, isError: isMigrateError } =
    useSimulateContract({
      ...migrateContract,
      query: {
        enabled: Boolean(enabled && migrateContract),
      },
    })

  const { data: multicallSimulation, isError: isMulticallError } =
    useSimulateContract({
      ...multicallContract,
      query: {
        enabled: Boolean(enabled && multicallContract),
      },
    })

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const simulation = migrateSimulation || multicallSimulation
  const isError = isMigrateError || isMulticallError

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      if (!account) return

      const receipt = client.waitForTransactionReceipt({ hash: data })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'swap',
        chainId: chainId,
        txHash: data,
        promise: client.waitForTransactionReceipt({ hash: data }),
        summary: {
          pending: 'Migrating your liquidity',
          completed: 'Successfully migrated your liquidity',
          failed: 'Failed to migrate liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [refetchBalances, account, chainId, client],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof Error) {
      if (!(e.cause instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
  }, [])

  const {
    writeContractAsync,
    writeContract: _,
    ...rest
  } = useWriteContract({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const write = useMemo(() => {
    if (!simulation) return undefined

    return async (confirm?: () => void) => {
      try {
        await writeContractAsync(simulation.request)
        confirm?.()
      } catch {}
    }
  }, [simulation, writeContractAsync])

  return {
    ...rest,
    write,
    isError,
  }
}
