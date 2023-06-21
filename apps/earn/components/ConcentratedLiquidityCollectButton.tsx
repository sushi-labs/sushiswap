import { Dispatch, FC, ReactElement, SetStateAction, useCallback } from 'react'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { TransactionRequest } from '@ethersproject/providers'
import { JSBI } from '@sushiswap/math'
import { Amount, Type } from '@sushiswap/currency'
import { isSushiSwapV3ChainId, NonfungiblePositionManager, Position } from '@sushiswap/v3-sdk'
import { _useSendTransaction as useSendTransaction } from '@sushiswap/wagmi'
import { ChainId } from '@sushiswap/chain'
import { ConcentratedLiquidityPosition } from '@sushiswap/wagmi/future/hooks'
import { unwrapToken } from '../lib/functions'
import { getV3NonFungiblePositionManagerConractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3NonFungiblePositionManager'
import { useNetwork } from '@sushiswap/wagmi'

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
  const { chain } = useNetwork()
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
      if (token0 && token1 && position && account && positionDetails && isSushiSwapV3ChainId(chainId)) {
        const feeValue0 = positionDetails.fees
          ? Amount.fromRawAmount(token0, JSBI.BigInt(positionDetails.fees[0]))
          : undefined
        const feeValue1 = positionDetails.fees
          ? Amount.fromRawAmount(token0, JSBI.BigInt(positionDetails.fees[1]))
          : undefined

        const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
          tokenId: positionDetails.tokenId.toString(),
          expectedCurrencyOwed0: feeValue0 ?? Amount.fromRawAmount(unwrapToken(token0), 0),
          expectedCurrencyOwed1: feeValue1 ?? Amount.fromRawAmount(unwrapToken(token1), 0),
          recipient: account,
        })

        setRequest({
          to: getV3NonFungiblePositionManagerConractConfig(chainId).address,
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
    enabled: Boolean(token0 && token1 && account && position && positionDetails && chainId === chain?.id),
  })

  return children(data)
}
