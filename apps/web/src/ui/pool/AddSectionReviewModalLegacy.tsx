import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  IconButton,
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import { type FC, type ReactNode, useCallback, useMemo } from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { NativeAddress } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { getSushiSwapRouterContractConfig } from 'src/lib/wagmi/hooks/contracts/useSushiSwapRouter'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import {
  getDefaultTTL,
  useTransactionDeadline,
} from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { useApproved } from 'src/lib/wagmi/systems/Checker/Provider'
import { type Amount, ZERO, subtractSlippage } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV2ChainId,
  addGasMargin,
  getEvmChainById,
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
import { useWaitForTransactionReceipt } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { AddSectionReviewModal } from './AddSectionReviewModal'

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
    if (token0.type === 'token' && token1.type === 'token') {
      return undefined
    }

    const value = BigInt(
      (token1.type === 'native' ? input1 : input0).amount.toString(),
    )
    const args = [
      (token1.type === 'native' ? token0 : token1).wrap().address,
      (token1.type === 'native' ? input0 : input1).amount,
      (token1.type === 'native' ? minAmount0 : minAmount1).amount,
      (token1.type === 'native' ? minAmount1 : minAmount0).amount,
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

    return async (confirm: () => void) => {
      try {
        await writeContractAsync({
          ...simulation.request,
          gas: simulation.request.gas
            ? addGasMargin(simulation.request.gas)
            : undefined,
        })

        confirm()
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
    if (token0.type === 'native' || token1.type === 'native') {
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

    return async (confirm: () => void) => {
      try {
        await writeContractAsync({
          ...simulation.request,
          gas: simulation.request.gas
            ? addGasMargin(simulation.request.gas)
            : undefined,
        })

        confirm()
      } catch {}
    }
  }, [writeContractAsync, simulation])

  return { ...rest, write }
}

interface AddSectionReviewModalLegacyProps {
  poolState: SushiSwapV2PoolState
  poolAddress: Address | undefined
  chainId: SushiSwapV2ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  input0: Amount<EvmCurrency> | undefined
  input1: Amount<EvmCurrency> | undefined
  children: ReactNode
  onSuccess: () => void
}

export const AddSectionReviewModalLegacy: FC<
  AddSectionReviewModalLegacyProps
> = ({
  poolAddress,
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
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
        token0_address:
          token0.type === 'native' ? NativeAddress : token0.address,
        token0_amount: input0?.amount,
        token1_address:
          token1.type === 'native' ? NativeAddress : token1.address,
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
  const data = writeWithNative.data || writeWithoutNative.data
  const isWritePending =
    writeWithNative.isPending || writeWithoutNative.isPending

  const { status } = useWaitForTransactionReceipt({ chainId, hash: data })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
              <div className="flex justify-between">
                <DialogHeader>
                  <DialogTitle>Add liquidity</DialogTitle>
                  <DialogDescription>
                    Please review your entered details.
                  </DialogDescription>
                </DialogHeader>
                <SettingsOverlay
                  options={{
                    slippageTolerance: {
                      storageKey: SlippageToleranceStorageKey.AddLiquidity,
                      title: 'Add Liquidity Slippage',
                    },
                    transactionDeadline: {
                      storageKey: TTLStorageKey.AddLiquidity,
                      defaultValue: getDefaultTTL(chainId).toString(),
                    },
                  }}
                  modules={[
                    SettingsModule.SlippageTolerance,
                    SettingsModule.TransactionDeadline,
                  ]}
                >
                  <IconButton
                    name="Settings"
                    icon={Cog6ToothIcon}
                    variant="secondary"
                    className="mr-12"
                  />
                </SettingsOverlay>
              </div>
              <AddSectionReviewModal
                chainId={chainId}
                input0={input0}
                input1={input1}
              />
              <DialogFooter>
                <Button
                  size="xl"
                  disabled={isWritePending || !approved || !write}
                  loading={Boolean(!write)}
                  fullWidth
                  onClick={() => write?.(confirm)}
                  testId="confirm-add-v2-liquidity"
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="incentivize-confirmation-modal"
        successMessage="Successfully added liquidity"
        buttonText="Go to pool"
        buttonLink={`/${getEvmChainById(chainId).key}/pool/v2/${poolAddress}`}
        txHash={data}
      />
    </DialogProvider>
  )
}
