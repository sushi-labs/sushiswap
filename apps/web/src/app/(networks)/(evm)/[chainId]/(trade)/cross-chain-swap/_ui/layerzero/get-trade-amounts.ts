import {
  type ValueTransferTrade,
  getValueTransferNativeCurrency,
} from 'src/lib/swap/value-transfer/trade'
import type { ValueTransferChainId } from 'src/lib/swap/value-transfer/types'
import { Amount } from 'sushi'

export interface LayerZeroTradeAmounts {
  amountIn: Amount<CurrencyFor<ValueTransferChainId>>
  amountOut: Amount<CurrencyFor<ValueTransferChainId>>
  minimumAmountOut: Amount<CurrencyFor<ValueTransferChainId>>
  messagingFee: Amount<CurrencyFor<ValueTransferChainId>>
  protocolFee: Amount<CurrencyFor<ValueTransferChainId>>
}

export function getLayerZeroTradeAmounts(
  quote: ValueTransferTrade,
): LayerZeroTradeAmounts {
  return {
    amountIn: new Amount(quote.token0, quote.amountIn),
    amountOut: new Amount(quote.token1, quote.amountOut),
    minimumAmountOut: new Amount(quote.token1, quote.minAmountOut),
    messagingFee: new Amount(
      getValueTransferNativeCurrency(quote.fromChainId),
      quote.maxNativeFee,
    ),
    protocolFee: new Amount(quote.token0, quote.protocolFee),
  }
}
