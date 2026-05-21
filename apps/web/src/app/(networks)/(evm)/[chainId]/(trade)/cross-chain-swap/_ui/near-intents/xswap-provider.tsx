'use client'

import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import {
  getCurrencyParam,
  isNearIntentsChainId,
} from 'src/lib/swap/near-intents'
import type {
  NearIntentsCurrencyEntry,
  NearIntentsDepositAddress,
  NearIntentsSupportedChainId,
} from 'src/lib/swap/near-intents/types'
import { Amount } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import type {
  NearIntentsQuoteResponse,
  NearIntentsStatusResponse,
} from '~evm/api/cross-chain/near-intents/schemas'
import { useRefetchBalances } from '../../../../../_common/ui/balance-provider/use-refetch-balances'
import {
  type XSwapFormMutators,
  type XSwapFormStateValues,
  useXSwapForm,
} from '../xswap-form-provider'
import { useNearIntentsActiveExecution } from './hooks/use-near-intents-active-execution'
import { useNearIntentsCurrencyCatalog } from './hooks/use-near-intents-currency-catalog'
import { useNearIntentsQuote } from './hooks/use-near-intents-quote'
import { useNearIntentsStatus } from './hooks/use-near-intents-status'
import { useNearIntentsTokens } from './hooks/use-near-intents-tokens'

interface NearIntentsXSwapState
  extends Omit<
    XSwapFormStateValues<
      NearIntentsSupportedChainId,
      NearIntentsSupportedChainId
    >,
    'chainId1' | 'token0Param' | 'token1Param'
  > {
  chainId1: NearIntentsSupportedChainId
  token0: CurrencyFor<NearIntentsSupportedChainId> | undefined
  token1: CurrencyFor<NearIntentsSupportedChainId> | undefined
  swapAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | undefined
  sourceTxHash: string | undefined
  depositAddress: NearIntentsDepositAddress | undefined
  depositMemo: string | undefined
}

interface NearIntentsXSwapContextValue {
  state: NearIntentsXSwapState
  mutate: Omit<
    XSwapFormMutators<NearIntentsSupportedChainId, NearIntentsSupportedChainId>,
    'setToken0Param' | 'setToken1Param' | 'setTokenParams'
  > & {
    clearActiveExecution(): void
    setActiveExecution(payload: {
      depositAddress: NearIntentsDepositAddress
      depositMemo?: string
      txHash: string
    }): void
    setToken0(currency: CurrencyFor<NearIntentsSupportedChainId>): void
    setToken1(currency: CurrencyFor<NearIntentsSupportedChainId>): void
  }
  currencyEntries: NearIntentsCurrencyEntry[]
  currenciesByChain: Partial<
    Record<
      NearIntentsSupportedChainId,
      Record<string, CurrencyFor<NearIntentsSupportedChainId>>
    >
  >
  isLoadingTokens: boolean
  previewQuote: {
    data: NearIntentsQuoteResponse | undefined
    executionDuration: string | undefined
    isLoading: boolean
    isFetching: boolean
    error: unknown
  }
  executionStatus: {
    data: NearIntentsStatusResponse | undefined
    isLoading: boolean
    isFetching: boolean
    error: unknown
  }
}

const NearIntentsXSwapContext = createContext<
  NearIntentsXSwapContextValue | undefined
>(undefined)

export interface NearIntentsXSwapProviderProps {
  children: ReactNode
}

function getOppositeDefaultChainId(
  sourceChainId: NearIntentsSupportedChainId,
): NearIntentsSupportedChainId {
  return sourceChainId === StellarChainId.STELLAR
    ? EvmChainId.ETHEREUM
    : StellarChainId.STELLAR
}

export function NearIntentsXSwapProvider({
  children,
}: NearIntentsXSwapProviderProps): ReactNode {
  const form = useXSwapForm<
    NearIntentsSupportedChainId,
    NearIntentsSupportedChainId
  >()

  const [slippagePercent] = useSlippageTolerance()
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const refreshedDestinationExecutionRef = useRef<string | undefined>(undefined)
  const { data: tokensResponse, isLoading: isLoadingTokens } =
    useNearIntentsTokens()
  const {
    currencyEntries,
    currenciesByChain,
    getCurrencyEntry,
    getDefaultTokenParams,
  } = useNearIntentsCurrencyCatalog(tokensResponse?.tokens)

  const { chainId0, token0Param, token1Param, swapAmountString } = form

  const chainId1: NearIntentsSupportedChainId =
    form.chainId1 && isNearIntentsChainId(form.chainId1)
      ? form.chainId1
      : getOppositeDefaultChainId(chainId0)

  const token0Entry = getCurrencyEntry(chainId0, token0Param)
  const token1Entry = getCurrencyEntry(chainId1, token1Param)

  const token0 = token0Entry?.currency
  const token1 = token1Entry?.currency
  const token0NearAssetId = token0Entry?.assetId
  const token1NearAssetId = token1Entry?.assetId

  const swapAmount = useMemo(
    () => (token0 ? Amount.tryFromHuman(token0, swapAmountString) : undefined),
    [swapAmountString, token0],
  )

  const {
    clearActiveExecution,
    depositAddress,
    depositMemo,
    setActiveExecution,
    sourceTxHash,
  } = useNearIntentsActiveExecution()

  // Persist the synchronously-resolved default chainId1 back to the URL.
  useEffect(() => {
    if (!form.chainId1 || !isNearIntentsChainId(form.chainId1)) {
      form.setChainId1(getOppositeDefaultChainId(chainId0))
    }
  }, [form.chainId1, form.setChainId1, chainId0])

  // Fill default tokens from the catalog once it loads.
  useEffect(() => {
    if (currencyEntries.length === 0) return
    if (!form.chainId1 || !isNearIntentsChainId(form.chainId1)) return
    if (token0Param && token1Param) return

    const defaults = getDefaultTokenParams(chainId0, chainId1)
    form.setTokenParams(
      token0Param ?? defaults.token0Param ?? null,
      token1Param ?? defaults.token1Param ?? null,
    )
  }, [
    currencyEntries,
    chainId0,
    chainId1,
    form.chainId1,
    token0Param,
    token1Param,
    form.setTokenParams,
    getDefaultTokenParams,
  ])

  // Any change to the swap inputs invalidates an in-flight deposit.
  // biome-ignore lint/correctness/useExhaustiveDependencies: input changes should clear execution state even though the callback does not read them.
  useEffect(() => {
    clearActiveExecution()
  }, [
    chainId1,
    token0Param,
    token1Param,
    swapAmountString,
    clearActiveExecution,
  ])

  const setToken0 = useCallback(
    (currency: CurrencyFor<NearIntentsSupportedChainId>) => {
      form.setToken0Param(getCurrencyParam(currency))
    },
    [form.setToken0Param],
  )

  const setToken1 = useCallback(
    (currency: CurrencyFor<NearIntentsSupportedChainId>) => {
      form.setToken1Param(getCurrencyParam(currency))
    },
    [form.setToken1Param],
  )

  const slippageBps = useMemo(
    () => Math.round(slippagePercent.toNumber() * 10_000),
    [slippagePercent],
  )
  const previewQuoteQuery = useNearIntentsQuote({
    fromChainId: chainId0,
    toChainId: chainId1,
    originAsset: token0NearAssetId,
    destinationAsset: token1NearAssetId,
    amount: swapAmount,
    slippageBps,
  })

  const executionDuration = useMemo(() => {
    const executionDurationSeconds = previewQuoteQuery.data?.quote.timeEstimate
    if (!executionDurationSeconds) return undefined

    const executionDurationMinutes = Math.floor(executionDurationSeconds / 60)

    return executionDurationSeconds < 60
      ? `${executionDurationSeconds} seconds`
      : `${executionDurationMinutes} minutes`
  }, [previewQuoteQuery.data?.quote.timeEstimate])

  const executionStatusQuery = useNearIntentsStatus({
    depositAddress,
    depositMemo,
  })

  useEffect(() => {
    if (executionStatusQuery.data?.status !== 'SUCCESS') return
    if (!sourceTxHash) return
    if (refreshedDestinationExecutionRef.current === sourceTxHash) return

    refreshedDestinationExecutionRef.current = sourceTxHash

    refetchBalances(chainId1)
  }, [
    chainId1,
    executionStatusQuery.data?.status,
    refetchBalances,
    sourceTxHash,
  ])

  const value: NearIntentsXSwapContextValue = useMemo(
    () => ({
      state: {
        chainId0,
        chainId1,
        tradeId: form.tradeId,
        token0,
        token1,
        swapAmountString,
        swapAmount,
        sourceTxHash,
        depositAddress,
        depositMemo,
      },
      mutate: {
        setChainId0: form.setChainId0,
        setChainId1: form.setChainId1,
        setToken0,
        setToken1,
        setSwapAmount: form.setSwapAmount,
        setTradeId: form.setTradeId,
        switchTokens: form.switchTokens,
        clearActiveExecution,
        setActiveExecution,
      },
      currencyEntries,
      currenciesByChain,
      isLoadingTokens,
      previewQuote: {
        data: previewQuoteQuery.data,
        executionDuration,
        isLoading: previewQuoteQuery.isLoading,
        isFetching: previewQuoteQuery.isFetching,
        error: previewQuoteQuery.error,
      },
      executionStatus: {
        data: executionStatusQuery.data,
        isLoading: executionStatusQuery.isLoading,
        isFetching: executionStatusQuery.isFetching,
        error: executionStatusQuery.error,
      },
    }),
    [
      chainId0,
      chainId1,
      token0,
      token1,
      swapAmount,
      swapAmountString,
      sourceTxHash,
      depositAddress,
      depositMemo,
      form.tradeId,
      form.setTradeId,
      form.setChainId0,
      form.setChainId1,
      form.setSwapAmount,
      form.switchTokens,
      clearActiveExecution,
      setActiveExecution,
      setToken0,
      setToken1,
      currencyEntries,
      currenciesByChain,
      executionDuration,
      isLoadingTokens,
      previewQuoteQuery,
      executionStatusQuery,
    ],
  )

  return (
    <NearIntentsXSwapContext.Provider value={value}>
      {children}
    </NearIntentsXSwapContext.Provider>
  )
}

export function useNearIntentsXSwap(): NearIntentsXSwapContextValue {
  const context = useContext(NearIntentsXSwapContext)

  if (!context) {
    throw new Error(
      'useNearIntentsXSwap can only be used inside NearIntentsXSwapContext Provider',
    )
  }

  return context
}
