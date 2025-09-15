import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { Button, Dots } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import React, { type FC, useCallback, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import type { EvmChainId } from 'sushi/chain'
import {
  SUSHISWAP_V3_POSITION_MANAGER,
  isSushiSwapV3ChainId,
} from 'sushi/config'
import type { Amount, Type } from 'sushi/currency'
import {
  NonfungiblePositionManager,
  type Position,
} from 'sushi/pool/sushiswap-v3'
import {
  type Hex,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  type UseCallParameters,
  useAccount,
  useCall,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import type { useConcentratedDerivedMintInfo } from '../ConcentratedLiquidityProvider'

interface AddLiquidityV3ButtonProps
  extends Pick<
    ReturnType<typeof useConcentratedDerivedMintInfo>,
    'noLiquidity' | 'position' | 'price' | 'pricesAtTicks' | 'ticksAtLimit'
  > {
  chainId: EvmChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  existingPosition: Position | undefined
  tokenId: number | string | undefined
  onSuccess: () => void
  successLink: string | undefined
}

export const AddLiquidityV3Button: FC<AddLiquidityV3ButtonProps> = ({
  chainId,
  token0,
  token1,
  input0,
  input1,
  noLiquidity,
  position,
  existingPosition,
  tokenId,
  onSuccess: _onSuccess,
  successLink,
}) => {
  const { address, chain } = useAccount()
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.AddLiquidity,
    chainId,
  })
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const client = usePublicClient()

  const trace = useTrace()

  const router = useRouter()

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const hasExistingPosition = !!existingPosition

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      _onSuccess()

      if (!token0 || !token1) return

      sendAnalyticsEvent(LiquidityEventName.ADD_LIQUIDITY_SUBMITTED, {
        chain_id: chainId,
        address,
        txHash: hash,
        source: LiquiditySource.V3,
        label: [token0.symbol, token1.symbol].join('/'),
        token0_address: token0.isNative ? NativeAddress : token0.address,
        token0_amount: input0?.quotient,
        token1_address: token1.isNative ? NativeAddress : token1.address,
        token1_amount: input1?.quotient,
        create_pool: noLiquidity,
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
          pending: noLiquidity
            ? `Creating the ${token0.symbol}/${token1.symbol} liquidity pool`
            : `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: noLiquidity
            ? `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
            : `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: noLiquidity
            ? 'Something went wrong when trying to create the pool'
            : 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
      if (successLink) {
        router.push(successLink)
      }
    },
    [
      refetchBalances,
      _onSuccess,
      token0,
      token1,
      address,
      chainId,
      client,
      noLiquidity,
      trace,
      input0,
      input1,
      successLink,
      router,
    ],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const prepare = useMemo(() => {
    if (
      !chainId ||
      !address ||
      !token0 ||
      !token1 ||
      !isSushiSwapV3ChainId(chainId) ||
      !position ||
      !deadline
    )
      return undefined

    const useNative = token0.isNative
      ? token0
      : token1.isNative
        ? token1
        : undefined
    const { calldata, value } =
      hasExistingPosition && tokenId
        ? NonfungiblePositionManager.addCallParameters(position, {
            tokenId,
            slippageTolerance,
            deadline: deadline.toString(),
            useNative,
          })
        : NonfungiblePositionManager.addCallParameters(position, {
            slippageTolerance,
            recipient: address,
            deadline: deadline.toString(),
            useNative,
            createPool: noLiquidity,
          })

    return {
      to: SUSHISWAP_V3_POSITION_MANAGER[chainId],
      account: address,
      chainId,
      data: calldata as Hex,
      value: BigInt(value),
    } as const satisfies UseCallParameters
  }, [
    address,
    chainId,
    deadline,
    hasExistingPosition,
    noLiquidity,
    position,
    slippageTolerance,
    token0,
    token1,
    tokenId,
  ])

  const { isError: isSimulationError } = useCall({
    ...(prepare as NonNullable<typeof prepare>),
    query: { enabled: Boolean(prepare && chainId === chain?.id) },
  })

  const { sendTransactionAsync, isPending: isWritePending } =
    useSendTransaction({
      mutation: {
        onSuccess,
        onError,
      },
    })

  const send = useMemo(() => {
    if (!prepare || isSimulationError) return undefined

    return async () => {
      try {
        await sendTransactionAsync(prepare)
      } catch {}
    }
  }, [sendTransactionAsync, isSimulationError, prepare])

  return (
    <Button
      size="xl"
      fullWidth
      loading={!send || isWritePending}
      onClick={() => send?.()}
      disabled={isSimulationError}
      testId="confirm-add-liquidity"
      type="button"
    >
      {isSimulationError ? (
        'Shoot! Something went wrong :('
      ) : isWritePending ? (
        <Dots>Adding Liquidity</Dots>
      ) : (
        'Add Liquidity'
      )}
    </Button>
  )
}
