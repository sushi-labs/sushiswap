import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import type {
  ValueTransferChain,
  ValueTransferQuote,
  ValueTransferQuoteRequest,
} from './schemas'
import { getValueTransferChainId } from './tokens'
import type { ValueTransferChainId } from './types'

export interface ValueTransferTrade {
  fromChainId: ValueTransferChainId
  toChainId: ValueTransferChainId
  srcChain: ValueTransferChain
  dstChain: ValueTransferChain
  token0: CurrencyFor<ValueTransferChainId>
  token1: CurrencyFor<ValueTransferChainId>
  sourceAddress: AddressFor<ValueTransferChainId> | undefined
  recipient: AddressFor<ValueTransferChainId> | undefined
  amountIn: bigint
  amountOut: bigint
  minAmountOut: bigint
  nativeFee: bigint
  maxNativeFee: bigint
  protocolFee: bigint
  estimatedSeconds: number | undefined
  quote: ValueTransferQuote
  quoteRequest: ValueTransferQuoteRequest
}

export function getValueTransferNativeCurrency(
  chainId: ValueTransferChainId,
): CurrencyFor<ValueTransferChainId> {
  return chainId === StellarChainId.STELLAR
    ? STELLAR_XLM[StellarChainId.STELLAR]
    : nativeFromChainId(chainId)
}

function sameTokenAddress(
  chain: ValueTransferChain,
  a: string,
  b: string,
): boolean {
  return chain.chainType === 'EVM'
    ? a.toLowerCase() === b.toLowerCase()
    : a === b
}

export function normalizeValueTransferTrade({
  quote,
  quoteRequest,
  srcChain,
  dstChain,
  token0,
  token1,
  sourceAddress,
  recipient,
}: {
  quote: ValueTransferQuote
  quoteRequest: ValueTransferQuoteRequest
  srcChain: ValueTransferChain
  dstChain: ValueTransferChain
  token0: CurrencyFor<ValueTransferChainId>
  token1: CurrencyFor<ValueTransferChainId>
  sourceAddress: AddressFor<ValueTransferChainId> | undefined
  recipient: AddressFor<ValueTransferChainId> | undefined
}): ValueTransferTrade {
  const fromChainId = getValueTransferChainId(srcChain)
  const toChainId = getValueTransferChainId(dstChain)
  if (
    !fromChainId ||
    !toChainId ||
    token0.chainId !== fromChainId ||
    token1.chainId !== toChainId
  ) {
    throw new Error('The quote networks do not match the selected tokens')
  }
  if (
    quoteRequest.srcChainKey !== srcChain.chainKey ||
    quoteRequest.dstChainKey !== dstChain.chainKey
  ) {
    throw new Error('The quote request does not match the selected networks')
  }
  const amountIn = BigInt(quote.srcAmount)
  const amountOut = BigInt(quote.dstAmount)
  const minAmountOut = BigInt(quote.dstAmountMin)
  if (
    amountIn !== BigInt(quoteRequest.amount) ||
    amountIn <= 0n ||
    amountOut <= 0n ||
    minAmountOut <= 0n ||
    minAmountOut > amountOut
  ) {
    throw new Error('Invalid Value Transfer quote amounts')
  }
  const nativeAddress = srcChain.nativeCurrency?.address
  const inputAddress = token0.type === 'native' ? nativeAddress : token0.address
  let nativeFee = 0n
  let protocolFee = 0n
  for (const fee of quote.fees) {
    if (fee.chainKey !== srcChain.chainKey) continue
    const amount = BigInt(fee.amount)
    if (amount < 0n) throw new Error('Invalid Value Transfer fee')
    if (
      nativeAddress &&
      sameTokenAddress(srcChain, fee.address, nativeAddress)
    ) {
      nativeFee += amount
    } else if (
      inputAddress &&
      sameTokenAddress(srcChain, fee.address, inputAddress)
    ) {
      protocolFee += amount
    }
  }
  const estimatedMilliseconds = Number(quote.duration.estimated)
  return {
    fromChainId,
    toChainId,
    srcChain,
    dstChain,
    token0,
    token1,
    sourceAddress,
    recipient,
    amountIn,
    amountOut,
    minAmountOut,
    nativeFee,
    maxNativeFee: nativeFee,
    protocolFee,
    estimatedSeconds:
      Number.isFinite(estimatedMilliseconds) && estimatedMilliseconds > 0
        ? estimatedMilliseconds / 1000
        : undefined,
    quote,
    quoteRequest,
  }
}
