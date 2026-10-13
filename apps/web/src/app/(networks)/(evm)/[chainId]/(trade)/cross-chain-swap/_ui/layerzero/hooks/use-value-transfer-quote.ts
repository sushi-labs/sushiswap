import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  NEAR_INTENTS_PREVIEW_EVM_ADDRESS_PLACEHOLDER,
  NEAR_INTENTS_PREVIEW_STELLAR_ADDRESS_PLACEHOLDER,
} from 'src/lib/swap/near-intents/placeholders'
import { getValueTransferQuoteExpiry } from 'src/lib/swap/value-transfer/quote-expiry'
import {
  type ValueTransferChain,
  type ValueTransferQuoteRequest,
  type ValueTransferToken,
  valueTransferQuoteResponseSchema,
} from 'src/lib/swap/value-transfer/schemas'
import {
  type ValueTransferTrade,
  normalizeValueTransferTrade,
} from 'src/lib/swap/value-transfer/trade'
import type { ValueTransferChainId } from 'src/lib/swap/value-transfer/types'
import { isAddressEqual } from 'sushi'

interface ValueTransferQuoteParams {
  token0?: CurrencyFor<ValueTransferChainId>
  token1?: CurrencyFor<ValueTransferChainId>
  srcToken?: ValueTransferToken
  dstToken?: ValueTransferToken
  srcChain?: ValueTransferChain
  dstChain?: ValueTransferChain
  amount?: bigint
  sourceAddress?: AddressFor<ValueTransferChainId>
  recipient?: AddressFor<ValueTransferChainId>
  enabled: boolean
  slippageBps: number
  order?: 'CHEAPEST' | 'FASTEST'
}

function previewAddress(chain: ValueTransferChain): string {
  if (chain.chainType === 'STELLAR')
    return NEAR_INTENTS_PREVIEW_STELLAR_ADDRESS_PLACEHOLDER
  if (chain.chainType === 'SOLANA') return '11111111111111111111111111111111'
  return NEAR_INTENTS_PREVIEW_EVM_ADDRESS_PLACEHOLDER
}

export async function fetchValueTransferQuote(
  params: ValueTransferQuoteParams,
  signal?: AbortSignal,
): Promise<ValueTransferTrade | null> {
  const {
    token0,
    token1,
    srcToken,
    dstToken,
    srcChain,
    dstChain,
    amount,
    sourceAddress,
    recipient,
    slippageBps,
    order,
  } = params
  if (
    !token0 ||
    !token1 ||
    !srcToken ||
    !dstToken ||
    !srcChain ||
    !dstChain ||
    !amount ||
    amount <= 0n
  ) {
    throw new Error('Select supported tokens and enter an amount')
  }
  if (
    !Number.isInteger(slippageBps) ||
    slippageBps < 0 ||
    slippageBps >= 10_000
  ) {
    throw new Error('Invalid slippage tolerance')
  }
  const quoteRequest: ValueTransferQuoteRequest = {
    srcChainKey: srcChain.chainKey,
    dstChainKey: dstChain.chainKey,
    srcTokenAddress: srcToken.address,
    dstTokenAddress: dstToken.address,
    srcWalletAddress: sourceAddress ?? previewAddress(srcChain),
    dstWalletAddress: recipient ?? previewAddress(dstChain),
    amount: amount.toString(),
    // The API describes this as fee variance tolerance. Independently enforce
    // the returned output minimum against the user's slippage below.
    options: {
      feeTolerance: { type: 'PERCENT', amount: slippageBps / 100 },
    },
  }
  const response = await fetch('/api/cross-chain/value-transfer/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteRequest),
    signal,
  })
  if (!response.ok) throw new Error('LayerZero quote unavailable')
  const { quotes, tokens } = valueTransferQuoteResponseSchema.parse(
    await response.json(),
  )
  const eligibleQuotes = quotes.filter(
    (candidate) =>
      BigInt(candidate.dstAmountMin) >=
      (BigInt(candidate.dstAmount) * BigInt(10_000 - slippageBps)) / 10_000n,
  )
  if (quotes.length && !eligibleQuotes.length)
    throw new Error('No LayerZero route meets your slippage tolerance')
  const nativeToken = tokens.find(
    (token) =>
      token.chainKey === srcChain.chainKey &&
      isAddressEqual(token.address, srcChain.nativeCurrency.address),
  )
  const nativePrice =
    nativeToken?.price?.usd ?? srcChain.nativeCurrency.price?.usd
  const nativeDecimals = srcChain.nativeCurrency.decimals
  function netOutput(trade: ValueTransferTrade): number {
    // Token-denominated fees are already reflected in dstAmount. Only subtract
    // the additional source-native fee, avoiding double-counting bridge fees.
    const nativeFeeUsd =
      nativePrice === undefined
        ? 0
        : (Number(trade.nativeFee) / 10 ** nativeDecimals) * nativePrice
    return Number(trade.quote.dstAmountUsd) - nativeFeeUsd
  }
  return eligibleQuotes.reduce<ValueTransferTrade | null>((best, candidate) => {
    const expiration = candidate.expiresAt
      ? getValueTransferQuoteExpiry(candidate.expiresAt)
      : undefined
    if (expiration !== undefined && expiration <= Date.now()) return best
    const trade = normalizeValueTransferTrade({
      quote: candidate,
      quoteRequest,
      srcChain,
      dstChain,
      token0,
      token1,
      sourceAddress,
      recipient,
    })
    if (!best) return trade
    if (
      order === 'FASTEST' &&
      trade.estimatedSeconds !== best.estimatedSeconds
    ) {
      return (trade.estimatedSeconds ?? Number.POSITIVE_INFINITY) <
        (best.estimatedSeconds ?? Number.POSITIVE_INFINITY)
        ? trade
        : best
    }
    const tradeOutput = netOutput(trade)
    const bestOutput = netOutput(best)
    if (tradeOutput !== bestOutput)
      return tradeOutput > bestOutput ? trade : best
    return trade.amountOut > best.amountOut ? trade : best
  }, null)
}

export function useValueTransferQuote(
  params: ValueTransferQuoteParams,
): UseQueryResult<ValueTransferTrade | null, Error> {
  return useQuery({
    queryKey: [
      'value-transfer-quote',
      params.srcChain?.chainKey,
      params.dstChain?.chainKey,
      params.srcToken?.address,
      params.dstToken?.address,
      params.amount?.toString(),
      params.sourceAddress,
      params.recipient,
      params.slippageBps,
      params.order,
    ],
    queryFn: ({ signal }) => fetchValueTransferQuote(params, signal),
    enabled:
      params.enabled &&
      Boolean(
        params.amount &&
          params.amount > 0n &&
          params.srcToken &&
          params.dstToken &&
          params.srcChain &&
          params.dstChain,
      ),
    staleTime: 20_000,
    refetchInterval: 20_000,
    retry: 2,
  })
}
