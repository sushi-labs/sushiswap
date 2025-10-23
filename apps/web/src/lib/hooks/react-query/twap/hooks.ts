import { eqIgnoreCase, getNetwork, zeroAddress } from '@orbs-network/twap-sdk'
import type { TokenListChainId } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import type { TwapOrder } from 'src/lib/hooks/react-query/twap'
import { useSearchTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-search-tokens'
import { type EvmChainId, type EvmCurrency, EvmNative } from 'sushi/evm'
import { formatDuration, getPnl, parseFill, safeFormatUnits } from './utils'

const useToken = (
  address?: string,
  chainId?: number,
): EvmCurrency | undefined => {
  const { data: token } = useSearchTokens({
    chainId: chainId as TokenListChainId,
    search: address,
  })

  if (eqIgnoreCase(address ?? '', zeroAddress) && chainId) {
    return EvmNative.fromChainId(chainId as EvmChainId)
  }

  return token?.[0]
}

export const useParsedOrder = (order: TwapOrder) => {
  const sellToken = useToken(order.srcTokenAddress, order.chainId)
  const buyToken = useToken(order.dstTokenAddress, order.chainId)

  return useMemo(() => {
    const sellTokenTotalUsdValue = Number(order.tradeDollarValueIn ?? '0')
    const chunksCountTotal = order.chunks
    const sellTokenTotalAmount = safeFormatUnits(
      order.srcAmount,
      sellToken?.decimals,
    )

    const fills =
      order.fills?.map((fill) => parseFill(order, fill, sellToken, buyToken)) ??
      []

    return {
      orderId: order.id,
      chainInfo: {
        id: order.chainId,
        name: getNetwork(order.chainId)?.name,
      },
      createdAtTimestamp: order.createdAt,
      deadlineTimestamp: order.deadline,
      status: order.status,
      sellToken,
      buyToken,
      sellTokenTotalUsdValue,
      sellTokenFilledAmount: safeFormatUnits(
        order.filledSrcAmount,
        sellToken?.decimals,
      ),
      buyTokenFilledAmount: safeFormatUnits(
        order.filledDstAmount,
        buyToken?.decimals,
      ),
      filledPercentage: order.progress,
      sellTokenTotalAmount,
      fullyFilledAtTimestamp: order.filledDate,
      buyTokenExpectedAmount: safeFormatUnits(
        order.dstMinAmount,
        buyToken?.decimals,
      ),
      transactionHash: order.txHash,
      transactionExplorerUrl: `${getNetwork(order.chainId)?.explorer}/tx/${order.txHash}`,
      chunksCountTotal,
      fillIntervalMs: order.fillDelayMs,
      usdPerChunk: sellTokenTotalUsdValue / chunksCountTotal,
      sellTokenAmountPerChunk: sellTokenTotalAmount / chunksCountTotal,
      sellTokenFilledUsdValue: Number(order.filledDollarValueIn),
      buyTokenFilledUsdValue: Number(order.filledDollarValueOut),
      remainingChunkCount: chunksCountTotal - (order.fills?.length ?? 0),
      orderDurationMs: order.deadline - order.createdAt,
      orderDurationFormatted: formatDuration(order.deadline - order.createdAt),
      profitAndLoss: getPnl(order),
      fills,
      avgBuyTokenAmountPerChunk:
        fills.reduce((acc, fill) => acc + Number(fill.buyAmount), 0) /
        fills.length,
      avgBuyTokenUsdPerChunk:
        fills.reduce((acc, fill) => acc + Number(fill.buyAmountUsd), 0) /
        fills.length,
    }
  }, [order, sellToken, buyToken])
}
