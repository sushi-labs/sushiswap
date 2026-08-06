'use client'

import { TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
} from '@sushiswap/telemetry'
import { type FC, type ReactElement, useCallback, useMemo } from 'react'
import { logger } from 'src/lib/logger'
import {
  type SushiSwapV4LiquidityConfig,
  encodeCLPositionManagerDecreaseLiquidityCalldata,
} from 'src/lib/pool/v4'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { Amount, Fraction } from 'sushi'
import {
  type EvmCurrency,
  EvmNative,
  NonfungiblePositionManager,
  type Position,
  SUSHISWAP_V3_POSITION_MANAGER,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import type { EvmChainId } from 'sushi/evm'
import type { Hex, SendTransactionReturnType } from 'viem'
import {
  type UseCallParameters,
  useCall,
  useConnection,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface ConcentratedLiquidityCollectButton {
  positionDetails: ConcentratedLiquidityPosition | undefined
  position: Position | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  account: `0x${string}` | undefined
  chainId: EvmChainId
  infinity?: SushiSwapV4LiquidityConfig
  tokenId?: bigint
  receiveWrapped?: boolean
  children(
    params: Omit<
      ReturnType<typeof useSendTransaction>,
      'mutate' | 'mutateAsync'
    > & { send: (() => Promise<void>) | undefined },
  ): ReactElement<any>
}

export const ConcentratedLiquidityCollectButton: FC<
  ConcentratedLiquidityCollectButton
> = ({
  account,
  chainId,
  position,
  positionDetails,
  children,
  token0,
  token1,
  infinity,
  tokenId,
  receiveWrapped = false,
}) => {
  const { chain } = useConnection()
  const client = usePublicClient()

  const { refetchChain: refetchBalances } = useRefetchBalances()
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.RemoveLiquidity,
    chainId,
  })

  const prepare = useMemo(() => {
    if (
      token0 &&
      token1 &&
      position &&
      account &&
      (positionDetails || (infinity && tokenId !== undefined)) &&
      deadline &&
      isSushiSwapV3ChainId(chainId)
    ) {
      if (infinity && tokenId !== undefined) {
        return {
          to: infinity.deployment.clPositionManager,
          chainId,
          data: encodeCLPositionManagerDecreaseLiquidityCalldata({
            tokenId,
            poolKey: infinity.poolKey,
            liquidity: 0n,
            amount0Min: 0n,
            amount1Min: 0n,
            wrapAddress: receiveWrapped
              ? EvmNative.fromChainId(chainId).wrap().address
              : undefined,
            recipient: account,
            hookData: '0x',
            deadline,
          }),
          value: 0n,
        } satisfies UseCallParameters
      }

      if (!positionDetails) return undefined

      const feeValue0 = positionDetails.fees
        ? new Amount(token0, positionDetails.fees[0])
        : undefined
      const feeValue1 = positionDetails.fees
        ? new Amount(token1, positionDetails.fees[1])
        : undefined

      const { calldata, value } =
        NonfungiblePositionManager.collectCallParameters(
          {
            tokenId: positionDetails.tokenId.toString(),
            expectedCurrencyOwed0: feeValue0 ?? new Amount(token0, 0),
            expectedCurrencyOwed1: feeValue1 ?? new Amount(token1, 0),
            recipient: account,
          },
          {
            minimumAmountTolerance: new Fraction(1),
          },
        )

      return {
        to: SUSHISWAP_V3_POSITION_MANAGER[chainId],
        chainId,
        data: calldata as Hex,
        value: BigInt(value),
      } satisfies UseCallParameters
    }

    return undefined
  }, [
    account,
    chainId,
    deadline,
    infinity,
    position,
    positionDetails,
    receiveWrapped,
    token0,
    token1,
    tokenId,
  ])

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      if (!position) return

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'claimRewards',
        chainId,
        txHash: hash,
        promise: client.waitForTransactionReceipt({ hash }),
        summary: {
          pending: `Collecting fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          completed: `Collected fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          failed: 'Something went wrong when trying to collect fees',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [refetchBalances, account, chainId, client, position],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) {
      return
    }

    logger.error(e, {
      location: 'ConcentratedLiquidityCollectButton',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const { isError: isSimulationError } = useCall({
    ...prepare,
    query: {
      enabled: Boolean(
        token0 &&
          token1 &&
          account &&
          position &&
          positionDetails &&
          chainId === chain?.id,
      ),
    },
  })

  const {
    mutateAsync: sendTransactionAsync,
    mutate: _,
    ...rest
  } = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const send = useMemo(() => {
    if (isSimulationError || !prepare) return

    return async () => {
      try {
        await sendTransactionAsync(prepare)
        if (!infinity) {
          sendAnalyticsEvent(LiquidityEventName.COLLECT_LIQUIDITY_SUBMITTED, {
            chain_id: prepare.chainId,
            address: account,
            source: LiquiditySource.V3,
            label: [token0?.symbol, token1?.symbol].join('/'),
          })
        }
      } catch {}
    }
  }, [
    isSimulationError,
    prepare,
    sendTransactionAsync,
    account,
    token0,
    token1,
    infinity,
  ])

  return children({ ...rest, send })
}
