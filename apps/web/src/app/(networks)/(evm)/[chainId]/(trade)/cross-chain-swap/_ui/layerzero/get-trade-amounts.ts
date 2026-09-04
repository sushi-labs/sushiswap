import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import {
  type LayerZeroChainId,
  getLayerZeroDecimals,
} from 'src/lib/swap/layerzero/config'
import { scaleLayerZeroAmount } from 'src/lib/swap/layerzero/quote'
import { getLayerZeroCurrency } from 'src/lib/swap/layerzero/tokens'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { Amount } from 'sushi'
import { STELLAR_XLM, StellarChainId } from 'sushi/stellar'

export interface LayerZeroTradeAmounts {
  amountIn: Amount<TokenFor<LayerZeroChainId>>
  amountOut: Amount<TokenFor<LayerZeroChainId>>
  minimumAmountOut: Amount<TokenFor<LayerZeroChainId>>
  messagingFee: Amount<CurrencyFor<LayerZeroChainId>>
  protocolFee: Amount<TokenFor<LayerZeroChainId>>
}

export function getLayerZeroTradeAmounts(
  quote: LayerZeroQuote,
): LayerZeroTradeAmounts {
  const token0 = getLayerZeroCurrency(quote.fromChainId)
  const token1 = getLayerZeroCurrency(quote.toChainId)
  const gasCurrency =
    quote.fromChainId === StellarChainId.STELLAR
      ? STELLAR_XLM[StellarChainId.STELLAR]
      : nativeFromChainId(quote.fromChainId)

  return {
    amountIn: new Amount(token0, quote.amountSent),
    amountOut: new Amount(token1, quote.amountOut),
    minimumAmountOut: new Amount(token1, quote.minAmountOut),
    messagingFee: new Amount(gasCurrency, quote.maxNativeFee),
    protocolFee: new Amount(
      token0,
      quote.amountSent -
        scaleLayerZeroAmount(
          quote.amountOut,
          getLayerZeroDecimals(quote.toChainId),
          getLayerZeroDecimals(quote.fromChainId),
        ),
    ),
  }
}
