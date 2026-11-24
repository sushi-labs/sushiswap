'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
} from '@sushiswap/telemetry'
import { type FC, type ReactElement, useCallback, useMemo } from 'react'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { Amount, Fraction } from 'sushi'
import {
  type EvmAddress,
  type EvmCurrency,
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
  account: EvmAddress | undefined
  chainId: EvmChainId
  onFeesClaimed?(): void
  children(
    params: Omit<
      ReturnType<typeof useSendTransaction>,
      'mutate' | 'mutateAsync'
    > & { send: (() => Promise<void>) | undefined },
  ): ReactElement
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
  onFeesClaimed,
}) => {
  const { chain } = useConnection()
  const client = usePublicClient({ chainId })

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const prepare = useMemo(() => {
    if (
      token0 &&
      token1 &&
      position &&
      account &&
      positionDetails &&
      isSushiSwapV3ChainId(chainId)
    ) {
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
  }, [account, chainId, position, positionDetails, token0, token1])

  const onSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
      if (!position) return

      sendAnalyticsEvent(LiquidityEventName.COLLECT_LIQUIDITY_SUBMITTED, {
        chain_id: chainId,
        address: account,
        source: LiquiditySource.V3,
        label: [token0?.symbol, token1?.symbol].join('/'),
      })

      const receipt = waitForSuccessfulReceipt(client, hash)
      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'claimRewards',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Collecting fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          completed: `Collected fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          failed: 'Something went wrong when trying to collect fees',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
      try {
        await receipt
      } catch (error) {
        logger.error(error, {
          location: 'ConcentratedLiquidityCollectButton',
          action: 'waitForReceipt',
        })
        return
      } finally {
        refetchBalances(chainId)
      }

      onFeesClaimed?.()
    },
    [
      refetchBalances,
      account,
      chainId,
      client,
      position,
      token0,
      token1,
      onFeesClaimed,
    ],
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

  const { isSuccess: isSimulated } = useCall({
    ...prepare,
    account,
    query: {
      enabled: Boolean(prepare && chainId === chain?.id),
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
    if (!isSimulated || !prepare || chainId !== chain?.id) return

    return async () => {
      try {
        await sendTransactionAsync(prepare)
      } catch {}
    }
  }, [isSimulated, prepare, sendTransactionAsync, chainId, chain?.id])

  return children({ ...rest, send })
}
