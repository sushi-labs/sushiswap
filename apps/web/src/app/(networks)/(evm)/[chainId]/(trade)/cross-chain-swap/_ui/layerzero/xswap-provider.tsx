'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import type { ValueTransferChainId } from 'src/lib/swap/value-transfer/types'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount } from 'sushi'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import { usePublicClient } from 'wagmi'
import { useLifiXSwap } from '../lifi/xswap-provider'
import { useNearIntentsXSwap } from '../near-intents/xswap-provider'
import { type XSwapFormMutators, useXSwapForm } from '../xswap-form-provider'
import {
  type LayerZeroExecutionState,
  useLayerZeroExecutions,
} from './hooks/use-layerzero-executions'
import {
  type LayerZeroSourceNetworkFee,
  useLayerZeroSourceNetworkFee,
} from './hooks/use-layerzero-source-network-fee'
import { useValueTransferCatalog } from './hooks/use-value-transfer-catalog'
import { useValueTransferQuote } from './hooks/use-value-transfer-quote'

interface LayerZeroXSwapContextValue {
  state: {
    chainId0: ValueTransferChainId
    chainId1: ValueTransferChainId
    token0: CurrencyFor<ValueTransferChainId> | undefined
    token1: CurrencyFor<ValueTransferChainId> | undefined
    swapAmountString: string
    swapAmount: Amount<CurrencyFor<ValueTransferChainId>> | undefined
    executions: LayerZeroExecutionState['executions']
    isSubmitting: boolean
    isUnsupportedPair: boolean
  }
  mutate: XSwapFormMutators<ValueTransferChainId, ValueTransferChainId> &
    LayerZeroExecutionState['mutate'] & {
      clearSwapAmountIfUnchanged(quote: ValueTransferTrade): void
    }
  previewQuote: UseQueryResult<ValueTransferTrade | null, Error>
  sourceNetworkFee: LayerZeroSourceNetworkFee
  catalog: ReturnType<typeof useValueTransferCatalog>
}

const LayerZeroXSwapContext = createContext<
  LayerZeroXSwapContextValue | undefined
>(undefined)

export function LayerZeroXSwapProvider({
  children,
  enabled = true,
}: { children: ReactNode; enabled?: boolean }): ReactNode {
  const form = useXSwapForm<ValueTransferChainId, ValueTransferChainId>()
  const chainId0 = form.chainId0
  const chainId1 =
    form.chainId1 ??
    (chainId0 === EvmChainId.ARBITRUM
      ? EvmChainId.ETHEREUM
      : EvmChainId.ARBITRUM)
  const catalog = useValueTransferCatalog()
  const { state: lifi } = useLifiXSwap()
  const { state: near } = useNearIntentsXSwap()
  const token0 =
    catalog.getCurrency(chainId0, form.token0Param) ??
    (lifi.token0?.chainId === chainId0
      ? lifi.token0
      : near.token0?.chainId === chainId0
        ? near.token0
        : undefined)
  const token1 =
    catalog.getCurrency(chainId1, form.token1Param) ??
    (lifi.token1?.chainId === chainId1
      ? lifi.token1
      : near.token1?.chainId === chainId1
        ? near.token1
        : undefined)
  const srcToken = catalog.getToken(chainId0, form.token0Param)
  const dstToken = catalog.getToken(chainId1, form.token1Param)
  const isUnsupportedPair =
    !catalog.isLoading &&
    !catalog.error &&
    Boolean(form.token0Param && form.token1Param) &&
    (!srcToken || !dstToken)
  const swapAmount = useMemo(
    () =>
      token0 ? Amount.tryFromHuman(token0, form.swapAmountString) : undefined,
    [token0, form.swapAmountString],
  )
  const sourceAddress = useAccount(chainId0)
  const recipient = useAccount(chainId1)
  const publicClient = usePublicClient({
    chainId: isEvmChainId(chainId0) ? chainId0 : undefined,
  })
  const [slippagePercent] = useSlippageTolerance()
  const executionState = useLayerZeroExecutions()
  const inputs = useRef({
    enabled,
    chainId0,
    chainId1,
    amount: swapAmount?.amount,
    token0,
    token1,
  })
  inputs.current = {
    enabled,
    chainId0,
    chainId1,
    amount: swapAmount?.amount,
    token0,
    token1,
  }
  const clearSwapAmountIfUnchanged = useCallback(
    (quote: ValueTransferTrade): void => {
      const current = inputs.current
      if (
        current.enabled &&
        current.chainId0 === quote.fromChainId &&
        current.chainId1 === quote.toChainId &&
        current.amount === quote.amountIn &&
        current.token0?.id === quote.token0.id &&
        current.token1?.id === quote.token1.id
      )
        form.setSwapAmount('')
    },
    [form.setSwapAmount],
  )
  const previewQuote = useValueTransferQuote({
    token0,
    token1,
    srcToken,
    dstToken,
    srcChain: catalog.getChain(chainId0),
    dstChain: catalog.getChain(chainId1),
    amount: swapAmount?.amount,
    sourceAddress,
    recipient,
    slippageBps: Math.round(slippagePercent.toNumber() * 10_000),
    enabled,
    order: lifi.routeOrder,
  })
  const sourceNetworkFee = useLayerZeroSourceNetworkFee({
    quote: previewQuote.data ?? undefined,
    enabled: enabled && Boolean(swapAmount?.gt(0n)) && !previewQuote.isError,
    publicClient,
  })
  return (
    <LayerZeroXSwapContext.Provider
      value={{
        state: {
          chainId0,
          chainId1,
          token0,
          token1,
          swapAmount,
          swapAmountString: form.swapAmountString,
          executions: executionState.executions,
          isSubmitting: executionState.isSubmitting,
          isUnsupportedPair,
        },
        mutate: {
          ...form,
          ...executionState.mutate,
          clearSwapAmountIfUnchanged,
        },
        previewQuote,
        sourceNetworkFee,
        catalog,
      }}
    >
      {children}
    </LayerZeroXSwapContext.Provider>
  )
}

export function useLayerZeroXSwap(): LayerZeroXSwapContextValue {
  const context = useContext(LayerZeroXSwapContext)
  if (!context)
    throw new Error(
      'useLayerZeroXSwap must be used inside LayerZeroXSwapProvider',
    )
  return context
}
