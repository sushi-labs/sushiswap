'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import {
  type LayerZeroChainId,
  getLayerZeroTokenAddress,
  isLayerZeroChainId,
  isLayerZeroEvmChainId,
  isLayerZeroUsdt0Route,
} from 'src/lib/swap/layerzero/config'
import { fetchLayerZeroQuote } from 'src/lib/swap/layerzero/quote'
import { getLayerZeroCurrency } from 'src/lib/swap/layerzero/tokens'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { usePublicClient } from 'wagmi'
import { type XSwapFormMutators, useXSwapForm } from '../xswap-form-provider'
import {
  type LayerZeroExecutionState,
  useLayerZeroExecutions,
} from './hooks/use-layerzero-executions'
import {
  type LayerZeroSourceNetworkFee,
  useLayerZeroSourceNetworkFee,
} from './hooks/use-layerzero-source-network-fee'

interface LayerZeroXSwapContextValue {
  state: {
    chainId0: LayerZeroChainId
    chainId1: LayerZeroChainId
    token0: TokenFor<LayerZeroChainId>
    token1: TokenFor<LayerZeroChainId>
    swapAmountString: string
    swapAmount: Amount<TokenFor<LayerZeroChainId>> | undefined
    executions: LayerZeroExecutionState['executions']
    isSubmitting: boolean
  }
  mutate: XSwapFormMutators<LayerZeroChainId, LayerZeroChainId> &
    LayerZeroExecutionState['mutate'] & {
      clearSwapAmountIfUnchanged(quote: LayerZeroQuote): void
    }
  previewQuote: UseQueryResult<LayerZeroQuote, Error>
  sourceNetworkFee: LayerZeroSourceNetworkFee
}

const LayerZeroXSwapContext = createContext<
  LayerZeroXSwapContextValue | undefined
>(undefined)

export function LayerZeroXSwapProvider({
  children,
}: { children: ReactNode }): ReactNode {
  const form = useXSwapForm<LayerZeroChainId, LayerZeroChainId>()
  const chainId0 = isLayerZeroChainId(form.chainId0)
    ? form.chainId0
    : EvmChainId.ETHEREUM
  const chainId1 =
    form.chainId1 && isLayerZeroChainId(form.chainId1)
      ? form.chainId1
      : chainId0 === StellarChainId.STELLAR
        ? EvmChainId.ETHEREUM
        : StellarChainId.STELLAR
  const enabled = isLayerZeroUsdt0Route(
    form.chainId0,
    chainId1,
    form.token0Param,
    form.token1Param,
  )
  const token0 = useMemo(() => getLayerZeroCurrency(chainId0), [chainId0])
  const token1 = useMemo(() => getLayerZeroCurrency(chainId1), [chainId1])
  const swapAmount = useMemo(
    () => Amount.tryFromHuman(token0, form.swapAmountString),
    [token0, form.swapAmountString],
  )
  const sourceAddress = useAccount(chainId0)
  const recipient = useAccount(chainId1)
  const publicClient = usePublicClient({
    chainId: isLayerZeroEvmChainId(chainId0) ? chainId0 : undefined,
  })
  const [slippagePercent] = useSlippageTolerance()
  const slippageBps = Math.round(slippagePercent.toNumber() * 10_000)
  const executionState = useLayerZeroExecutions()
  const inputs = useRef({
    enabled,
    chainId0,
    chainId1,
    amount: swapAmount?.amount,
  })
  inputs.current = { enabled, chainId0, chainId1, amount: swapAmount?.amount }
  const clearSwapAmountIfUnchanged = useCallback(
    (quote: LayerZeroQuote): void => {
      const current = inputs.current
      if (
        current.enabled &&
        current.chainId0 === quote.fromChainId &&
        current.chainId1 === quote.toChainId &&
        current.amount === quote.amountIn
      )
        form.setSwapAmount('')
    },
    [form.setSwapAmount],
  )

  useEffect(() => {
    if (!enabled) return
    if (!form.chainId1) {
      form.setChainId1(chainId1)
      return
    }
    // EvmToken and the existing currency catalog use lowercase address keys.
    if (
      form.token0Param !== getLayerZeroTokenAddress(chainId0) ||
      form.token1Param !== getLayerZeroTokenAddress(chainId1)
    ) {
      form.setTokenParams(
        getLayerZeroTokenAddress(chainId0),
        getLayerZeroTokenAddress(chainId1),
      )
    }
  }, [
    enabled,
    chainId0,
    chainId1,
    form.chainId1,
    form.token0Param,
    form.token1Param,
    form.setChainId1,
    form.setTokenParams,
  ])

  const previewQuote = useQuery({
    queryKey: [
      'layerzero-quote',
      chainId0,
      chainId1,
      swapAmount?.amount.toString(),
      slippageBps,
      sourceAddress,
      recipient,
    ],
    queryFn: () => {
      if (!swapAmount?.gt(0n)) throw new Error('Enter an amount')
      return fetchLayerZeroQuote({
        fromChainId: chainId0,
        toChainId: chainId1,
        amount: swapAmount.amount,
        slippageBps,
        sourceAddress,
        recipient,
        publicClient,
      })
    },
    enabled:
      enabled &&
      Boolean(swapAmount?.gt(0n)) &&
      (chainId0 === StellarChainId.STELLAR || Boolean(publicClient)),
    staleTime: 30_000,
    refetchInterval: 30_000,
    // Quotes are read-only: recover transient RPC/spec-loading failures without
    // requiring an amount edit or waiting for the next 30-second refresh.
    retry: 2,
  })

  const sourceNetworkFee = useLayerZeroSourceNetworkFee({
    quote: previewQuote.data,
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
        },
        mutate: {
          ...form,
          ...executionState.mutate,
          clearSwapAmountIfUnchanged,
        },
        previewQuote,
        sourceNetworkFee,
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
