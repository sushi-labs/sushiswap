import { Dispatch, FC, ReactElement, ReactNode, SetStateAction, useCallback } from 'react'
import { SendTransactionResult } from 'wagmi/actions'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { TransactionRequest } from '@ethersproject/providers'
import { JSBI } from '@sushiswap/math'
import { Amount, Native, Type } from '@sushiswap/currency'
import { NonfungiblePositionManager, Position } from '@sushiswap/v3-sdk'
import { useSendTransaction } from '@sushiswap/wagmi'
import { ChainId } from '@sushiswap/chain'
import { ConcentratedLiquidityPosition } from '@sushiswap/wagmi/future/hooks'

interface ConcentratedLiquidityCollectButton {
  positionDetails: ConcentratedLiquidityPosition | undefined
  position: Position | undefined
  token0: Type | undefined
  token1: Type | undefined
  account: `0x${string}` | undefined
  chainId: ChainId
  children(params: ReturnType<typeof useSendTransaction>): ReactElement
}
export const ConcentratedLiquidityCollectButton: FC<ConcentratedLiquidityCollectButton> = ({
  account,
  chainId,
  position,
  positionDetails,
  children,
  token0,
  token1,
}) => {
  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !position) return

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'claimRewards',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Collecting fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          completed: `Collected fees from your ${position.amount0.currency.symbol}/${position.amount1.currency.symbol} position`,
          failed: 'Something went wrong when trying to collect fees',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [position, account, chainId]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (token0 && token1 && position && account && positionDetails) {
        const feeValue0 = positionDetails.fees
          ? Amount.fromRawAmount(token0, JSBI.BigInt(positionDetails.fees[0]))
          : undefined
        const feeValue1 = positionDetails.fees
          ? Amount.fromRawAmount(token0, JSBI.BigInt(positionDetails.fees[1]))
          : undefined

        const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
          tokenId: positionDetails.tokenId.toString(),
          expectedCurrencyOwed0:
            feeValue0 ??
            Amount.fromRawAmount(
              token0.wrapped.address === Native.onChain(chainId).wrapped.address ? Native.onChain(chainId) : token0,
              0
            ),
          expectedCurrencyOwed1:
            feeValue1 ??
            Amount.fromRawAmount(
              token0.wrapped.address === Native.onChain(chainId).wrapped.address ? Native.onChain(chainId) : token0,
              0
            ),
          recipient: account,
        })

        setRequest({
          // TODO make dynamic
          to: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
          data: calldata,
          value,
        })
      }
    },
    [account, chainId, position, positionDetails, token0, token1]
  )

  const data = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    enabled: Boolean(token0 && token1 && account && position && positionDetails),
  })

  return children(data)
}
