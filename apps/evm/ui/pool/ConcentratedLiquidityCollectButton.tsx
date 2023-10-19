'use client'

import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import {
  NonfungiblePositionManager,
  Position,
  isSushiSwapV3ChainId,
} from '@sushiswap/v3-sdk'
import {
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
} from '@sushiswap/wagmi'
import {
  SendTransactionResult,
  waitForTransaction,
} from '@sushiswap/wagmi/actions'
import { ConcentratedLiquidityPosition } from '@sushiswap/wagmi/future/hooks'
import { getV3NonFungiblePositionManagerConractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3NonFungiblePositionManager'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { unwrapToken } from 'lib/functions'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { Amount, Type } from 'sushi/currency'
import { Hex, UserRejectedRequestError } from 'viem'

interface ConcentratedLiquidityCollectButton {
  positionDetails: ConcentratedLiquidityPosition | undefined
  position: Position | undefined
  token0: Type | undefined
  token1: Type | undefined
  account: `0x${string}` | undefined
  chainId: ChainId
  children(params: ReturnType<typeof useSendTransaction>): ReactElement
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
}) => {
  const { chain } = useNetwork()

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (
      token0 &&
      token1 &&
      position &&
      account &&
      positionDetails &&
      isSushiSwapV3ChainId(chainId)
    ) {
      const feeValue0 = positionDetails.fees
        ? Amount.fromRawAmount(token0, positionDetails.fees[0])
        : undefined
      const feeValue1 = positionDetails.fees
        ? Amount.fromRawAmount(token0, positionDetails.fees[1])
        : undefined

      const { calldata, value } =
        NonfungiblePositionManager.collectCallParameters({
          tokenId: positionDetails.tokenId.toString(),
          expectedCurrencyOwed0:
            feeValue0 ?? Amount.fromRawAmount(unwrapToken(token0), 0),
          expectedCurrencyOwed1:
            feeValue1 ?? Amount.fromRawAmount(unwrapToken(token1), 0),
          recipient: account,
        })

      return {
        to: getV3NonFungiblePositionManagerConractConfig(chainId).address,
        data: calldata as Hex,
        value: BigInt(value),
      }
    }

    return {}
  }, [account, chainId, position, positionDetails, token0, token1])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }

      if (!data || !position) return

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'claimRewards',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Collecting fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          completed: `Collected fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          failed: 'Something went wrong when trying to collect fees',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [account, chainId, position],
  )

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(
      token0 &&
        token1 &&
        account &&
        position &&
        positionDetails &&
        chainId === chain?.id,
    ),
  })

  const data = useSendTransaction({
    ...config,
    onSettled,
  })

  return children(data)
}
