import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'

import { Button } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import { type FC, type ReactNode, useCallback, useMemo } from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { NativeAddress } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { getSushiSwapRouterContractConfig } from 'src/lib/wagmi/hooks/contracts/useSushiSwapRouter'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import { type Amount, ZERO, subtractSlippage } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV2ChainId,
  addGasMargin,
} from 'sushi/evm'
import {
  type Address,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  type UseSimulateContractParameters,
  usePublicClient,
  useWriteContract,
} from 'wagmi'
import { useSimulateContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface UseAddSushiSwapV2 {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  chainId: SushiSwapV2ChainId
  input0: Amount<EvmCurrency> | undefined
  input1: Amount<EvmCurrency> | undefined
  address: Address | undefined
  minAmount0: Amount<EvmCurrency> | undefined
  minAmount1: Amount<EvmCurrency> | undefined
  deadline: bigint | undefined
  mutation: {
    onSuccess: (data: SendTransactionReturnType) => void
    onError: (e: Error) => void
  }
}

function useWriteWithNative({
  token0,
  token1,
  chainId,
  input0,
  input1,
  address,
  minAmount0,
  minAmount1,
  deadline,
  mutation,
}: UseAddSushiSwapV2) {
  const prepare = useMemo(() => {
    if (
      !token0 ||
      !token1 ||
      !input0 ||
      !input1 ||
      !address ||
      !minAmount0 ||
      !minAmount1 ||
      !deadline
    ) {
      return undefined
    }

    if (minAmount0.eq(ZERO) || minAmount1.eq(ZERO)) {
      return undefined
    }

    // With native
    if (!token0.isNative && !token1.isNative) {
      return undefined
    }

    const value = BigInt((token1.isNative ? input1 : input0).amount)
    const args = [
      (token1.isNative ? token0 : token1).wrap().address,
      (token1.isNative ? input0 : input1).amount,
      (token1.isNative ? minAmount0 : minAmount1).amount,
      (token1.isNative ? minAmount1 : minAmount0).amount,
      address,
      deadline,
    ] as const

    const contract = getSushiSwapRouterContractConfig(chainId)

    return {
      account: address,
      address: contract.address,
      chainId,
      abi: contract.abi,
      functionName: 'addLiquidityETH',
      args,
      value,
    } as const satisfies UseSimulateContractParameters
  }, [
    address,
    chainId,
    deadline,
    input0,
    input1,
    minAmount0,
    minAmount1,
    token0,
    token1,
  ])

  const { data: simulation } = useSimulateContract({
    ...(prepare as NonNullable<typeof prepare>),
    query: {
      enabled: Boolean(prepare),
    },
  })

  const {
    writeContractAsync,
    writeContract: _,
    ...rest
  } = useWriteContract({
    mutation,
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return undefined

    return async () => {
      try {
        await writeContractAsync({
          ...simulation.request,
          gas: simulation.request.gas
            ? addGasMargin(simulation.request.gas)
            : undefined,
        })
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return { ...rest, write }
}

function useWriteWithoutNative({
  token0,
  token1,
  chainId,
  input0,
  input1,
  address,
  minAmount0,
  minAmount1,
  deadline,
  mutation,
}: UseAddSushiSwapV2) {
  const prepare = useMemo(() => {
    if (
      !token0 ||
      !token1 ||
      !input0 ||
      !input1 ||
      !address ||
      !minAmount0 ||
      !minAmount1 ||
      !deadline
    ) {
      return undefined
    }

    if (minAmount0.eq(ZERO) || minAmount1.eq(ZERO)) {
      return undefined
    }

    // No native
    if (token0.isNative || token1.isNative) {
      return undefined
    }

    const args = [
      token0.wrap().address,
      token1.wrap().address,
      input0.amount,
      input1.amount,
      minAmount0.amount,
      minAmount1.amount,
      address,
      deadline,
    ] as const

    const contract = getSushiSwapRouterContractConfig(chainId)

    return {
      account: address,
      address: contract.address,
      chainId: chainId,
      abi: contract.abi,
      functionName: 'addLiquidity',
      args,
    } as const
  }, [
    address,
    chainId,
    deadline,
    input0,
    input1,
    minAmount0,
    minAmount1,
    token0,
    token1,
  ])

  const { data: simulation } = useSimulateContract({
    ...(prepare as NonNullable<typeof prepare>),
    query: {
      enabled: Boolean(prepare),
    },
  })

  const {
    writeContractAsync,
    writeContract: _,
    ...rest
  } = useWriteContract({
    mutation,
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return undefined

    return async () => {
      try {
        await writeContractAsync({
          ...simulation.request,
          gas: simulation.request.gas
            ? addGasMargin(simulation.request.gas)
            : undefined,
        })
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return { ...rest, write }
}

interface AddLiquidityV2ButtonProps {
  poolState: SushiSwapV2PoolState
  chainId: SushiSwapV2ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  input0: Amount<EvmCurrency> | undefined
  input1: Amount<EvmCurrency> | undefined
  onSuccess: () => void
}

export const AddLiquidityV2Button: FC<AddLiquidityV2ButtonProps> = ({
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  onSuccess: _onSuccess,
}) => {
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.AddLiquidity,
    chainId,
  })
  const { address } = useAccount()
  const { approved } = useApproved(APPROVE_TAG_ADD_LEGACY)
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const client = usePublicClient()
  const trace = useTrace()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      _onSuccess()

      if (!token0 || !token1) return

      sendAnalyticsEvent(LiquidityEventName.REMOVE_LIQUIDITY_SUBMITTED, {
        chain_id: chainId,
        txHash: hash,
        address,
        source: LiquiditySource.V2,
        label: [token0.symbol, token1.symbol].join('/'),
        token0_address: token0.isNative ? NativeAddress : token0.address,
        token0_amount: input0?.amount,
        token1_address: token1.isNative ? NativeAddress : token1.address,
        token1_amount: input1?.amount,
        create_pool: poolState === SushiSwapV2PoolState.NOT_EXISTS,
        ...trace,
      })

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [
      refetchBalances,
      client,
      chainId,
      token0,
      token1,
      address,
      _onSuccess,
      trace,
      poolState,
      input0,
      input1,
    ],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === SushiSwapV2PoolState.NOT_EXISTS
          ? input0
          : subtractSlippage(input0, slippageTolerance.toNumber())
        : undefined,
      input1
        ? poolState === SushiSwapV2PoolState.NOT_EXISTS
          ? input1
          : subtractSlippage(input1, slippageTolerance.toNumber())
        : undefined,
    ]
  }, [poolState, input0, input1, slippageTolerance])

  const writeWithNative = useWriteWithNative({
    token0,
    token1,
    chainId,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    deadline,
    mutation: {
      onSuccess,
      onError,
    },
  })

  const writeWithoutNative = useWriteWithoutNative({
    token0,
    token1,
    chainId,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    deadline,
    mutation: {
      onSuccess,
      onError,
    },
  })

  // check shouldn't be necessary
  const write = writeWithNative.write || writeWithoutNative.write
  const isWritePending =
    writeWithNative.isPending || writeWithoutNative.isPending

  return (
    <Button
      size="xl"
      disabled={isWritePending || !approved || !write}
      loading={Boolean(!write)}
      fullWidth
      onClick={() => write?.()}
      testId="confirm-add-v2-liquidity"
    >
      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add Liquidity'}
    </Button>
  )
}
