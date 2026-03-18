'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createInfoToast, createToast } from '@sushiswap/notifications'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import {
  DialogContent,
  DialogFooter,
  DialogProvider,
  DialogReview,
} from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import {
  StepState,
  finishedState,
  pendingState,
  useNearIntentsStatus,
} from 'src/lib/near-intents/hooks/use-near-intents-status'
import { useAccount } from 'src/lib/wallet'
import { ChainId, getChainById } from 'sushi'
import type { EvmAddress, EvmChainId } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useExecuteCrossChainSwap } from '~stellar/_common/lib/hooks/swap'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { parseSlippageTolerance } from '~stellar/_common/lib/utils/error-helpers'
import { requiresPriceImpactConfirmation } from '~stellar/_common/lib/utils/warning-severity'
import { ConfirmSwapButton } from './cross-chain-swap-trade-review-dialog/confirm-swap-button'
import {
  ConfirmationDialogContent,
  Divider,
  GetStateComponent,
} from './cross-chain-swap-trade-review-dialog/cross-chain-swap-confirmation-dialog'
import { DialogBody } from './cross-chain-swap-trade-review-dialog/dialog-body'
import { RecipientSection } from './cross-chain-swap-trade-review-dialog/recipient-section'
import { ReviewIntro } from './cross-chain-swap-trade-review-dialog/review-intro'
import { TradeDetails } from './cross-chain-swap-trade-review-dialog/trade-details'
import { TradeHeader } from './cross-chain-swap-trade-review-dialog/trade-header'
import { TradeWarnings } from './cross-chain-swap-trade-review-dialog/trade-warnings'
import {
  useCrossChainTradeSwap,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

interface CrossChainSwapTradeReviewDialogProps {
  children: ReactNode
}

interface SwapContext {
  depositAddress: string
  correlationId: string
  token0: Token
  token1: {
    symbol: string
    decimals: number
    isNative: boolean
    address: string
  }
  amountIn: bigint
  recipient: EvmAddress
  chainId1: EvmChainId
}

export function CrossChainSwapTradeReviewDialog({
  children,
}: CrossChainSwapTradeReviewDialogProps) {
  return (
    <DialogProvider>
      <CrossChainSwapTradeReviewDialogContent>
        {children}
      </CrossChainSwapTradeReviewDialogContent>
    </DialogProvider>
  )
}

function CrossChainSwapTradeReviewDialogContent({
  children,
}: {
  children: ReactNode
}) {
  const connectedAddress = useAccount('stellar')
  const { state, mutate } = useDerivedStateCrossChainSwap()
  const { token0, token1, swapAmountString, recipient, chainId1 } = state
  const { setSwapAmount } = mutate

  const [stepStates, setStepStates] = useState({
    source: StepState.NotStarted,
    bridge: StepState.NotStarted,
    dest: StepState.NotStarted,
  })
  const [txHash, setTxHash] = useState<string | undefined>()
  const [swapContext, setSwapContext] = useState<SwapContext | undefined>()
  const [groupTs, setGroupTs] = useState<number | undefined>()

  const executeCrossChainSwap = useExecuteCrossChainSwap()
  const [, { slippageTolerance }] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const { data: swapData } = useCrossChainTradeSwap()

  const { data: statusData } = useNearIntentsStatus({
    depositAddress: swapContext?.depositAddress,
    depositMemo: swapContext?.correlationId,
    correlationId: swapContext?.correlationId,
    enabled: !!swapContext && pendingState(stepStates),
  })

  const amountIn = useMemo(() => {
    if (!swapAmountString || Number(swapAmountString) <= 0 || !token0) return 0n
    try {
      const [integer = '0', fraction = ''] = swapAmountString.split('.')
      const normalizedFraction = fraction
        .padEnd(token0.decimals, '0')
        .slice(0, token0.decimals)
      const digits =
        `${integer}${normalizedFraction}`.replace(/^0+(?=\d)/, '') || '0'
      return BigInt(digits)
    } catch {
      return 0n
    }
  }, [swapAmountString, token0])

  const showSlippageWarning = useMemo(() => {
    const slippage = parseSlippageTolerance(slippageTolerance)
    return slippage > 20
  }, [slippageTolerance])

  const priceImpact = useMemo(() => {
    if (!swapData?.quote?.amountInUsd || !swapData?.quote?.amountOutUsd)
      return null
    const amountInUsd = Number(swapData.quote.amountInUsd)
    const amountOutUsd = Number(swapData.quote.amountOutUsd)
    if (amountInUsd <= 0) return null
    return ((amountInUsd - amountOutUsd) / amountInUsd) * 100
  }, [swapData])

  const showPriceImpactWarning = requiresPriceImpactConfirmation(
    priceImpact || undefined,
  )

  // Update step states based on Near Intents status
  useEffect(() => {
    if (!statusData) return

    const status = statusData.status

    setStepStates((prev) => {
      const newStepStates = { ...prev }

      // Map Near Intents status to StepState
      switch (status) {
        case 'KNOWN_DEPOSIT_TX':
        case 'PENDING_DEPOSIT':
          newStepStates.source = StepState.Success
          newStepStates.bridge = StepState.Pending
          break
        case 'INCOMPLETE_DEPOSIT':
          newStepStates.source = StepState.PartialSuccess
          break
        case 'PROCESSING':
          newStepStates.source = StepState.Success
          newStepStates.bridge = StepState.Pending
          break
        case 'SUCCESS':
          newStepStates.source = StepState.Success
          newStepStates.bridge = StepState.Success
          newStepStates.dest = StepState.Success
          break
        case 'REFUNDED':
          newStepStates.source = StepState.Success
          newStepStates.bridge = StepState.Success
          newStepStates.dest = StepState.PartialSuccess
          break
        case 'FAILED':
          newStepStates.dest = StepState.Failed
          break
      }

      return newStepStates
    })
  }, [statusData])

  // Show destination toast when destination tx is available
  useEffect(() => {
    if (
      !statusData?.swapDetails?.destinationChainTxHashes?.length ||
      !groupTs ||
      !chainId1 ||
      !token1
    )
      return

    const dstTx = statusData.swapDetails.destinationChainTxHashes[0]
    const dstChain = getChainById(chainId1)
    const amountOut =
      statusData.swapDetails.amountOutFormatted ||
      statusData.swapDetails.amountOut

    const summary = {
      pending: `Receiving ${amountOut} ${token1.symbol} on ${dstChain.name}`,
      completed: `Received ${amountOut} ${token1.symbol} on ${dstChain.name}`,
      failed: `Something went wrong when trying to receive ${amountOut} ${token1.symbol} on ${dstChain.name}`,
    }

    const promise = Promise.resolve().then(() => {
      sendAnalyticsEvent(SwapEventName.XSWAP_DST_TRANSACTION_COMPLETED, {
        chain_id: chainId1,
        txHash: dstTx.hash,
      })
    })

    void createToast({
      account: connectedAddress,
      type: 'swap',
      chainId: chainId1,
      txHash: dstTx.hash as `0x${string}`,
      promise,
      summary,
      timestamp: new Date().getTime(),
      groupTimestamp: groupTs,
    })
  }, [statusData, groupTs, chainId1, token1, connectedAddress])

  // Show bridge processing toast
  useEffect(() => {
    if (stepStates.bridge !== StepState.Pending || !groupTs || !swapContext)
      return

    const originTx = statusData?.swapDetails?.originChainTxHashes?.[0]

    void createInfoToast({
      account: connectedAddress,
      type: 'xswap',
      chainId: ChainId.STELLAR,
      href: originTx?.explorerUrl,
      summary: `Bridging ${swapContext.token0.code} from Stellar to ${swapContext.token1.symbol} on ${getChainById(swapContext.chainId1).name}`,
      timestamp: new Date().getTime(),
      groupTimestamp: groupTs,
    })
  }, [
    stepStates.bridge,
    groupTs,
    swapContext,
    connectedAddress,
    statusData?.swapDetails?.originChainTxHashes,
  ])

  const handleSwap = useCallback(async () => {
    if (
      !connectedAddress ||
      !token0 ||
      !token1 ||
      !swapAmountString ||
      Number(swapAmountString) <= 0 ||
      !recipient ||
      !swapData?.quote?.depositAddress ||
      !chainId1
    ) {
      return
    }

    const tokenOutAddress = token1.isNative
      ? zeroAddress
      : (token1.address as EvmAddress)

    setStepStates((prev) => ({ ...prev, source: StepState.Sign }))

    try {
      const result = await executeCrossChainSwap.mutateAsync({
        userAddress: connectedAddress,
        tokenIn: token0,
        tokenOut: {
          symbol: token1.symbol,
          decimals: token1.decimals,
          address: tokenOutAddress,
        },
        amountIn,
        depositAddress: swapData.quote.depositAddress,
        recipient: recipient as EvmAddress,
        correlationId: swapData.correlationId,
      })

      // Store context for status tracking
      setTxHash(result.txHash)
      setSwapContext({
        depositAddress: swapData.quote.depositAddress,
        correlationId: swapData.correlationId,
        token0,
        token1: {
          symbol: token1.symbol,
          decimals: token1.decimals,
          isNative: token1.isNative,
          address: token1.isNative ? zeroAddress : token1.address,
        },
        amountIn,
        recipient: recipient as EvmAddress,
        chainId1,
      })
      setGroupTs(new Date().getTime())
      setStepStates({
        source: StepState.Pending,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      setSwapAmount('')
    } catch (error) {
      console.error('Error executing cross-chain swap:', error)
      setStepStates((prev) => ({ ...prev, source: StepState.Failed }))
    }
  }, [
    connectedAddress,
    token0,
    token1,
    swapAmountString,
    recipient,
    swapData,
    amountIn,
    executeCrossChainSwap,
    setSwapAmount,
    chainId1,
  ])

  const write = useCallback(
    async (confirm: () => void) => {
      await handleSwap()
      confirm()
    },
    [handleSwap],
  )

  const isWritePending = executeCrossChainSwap.isPending
  const isEstGasError = false
  const isStepQueryError = false
  const estGasError: Error | null = null

  const dstTxHash = statusData?.swapDetails?.destinationChainTxHashes?.[0]?.hash
  const dstTxExplorerUrl =
    statusData?.swapDetails?.destinationChainTxHashes?.[0]?.explorerUrl
  const amountOut = statusData?.swapDetails?.amountOutFormatted

  // Show confirmation dialog when swap is in progress or finished
  const showConfirmation = pendingState(stepStates) || finishedState(stepStates)

  const resetSwap = useCallback(() => {
    setStepStates({
      source: StepState.NotStarted,
      bridge: StepState.NotStarted,
      dest: StepState.NotStarted,
    })
    setTxHash(undefined)
    setSwapContext(undefined)
    setGroupTs(undefined)
  }, [])

  if (showConfirmation) {
    return (
      <DialogProvider>
        <DialogReview>
          {({ confirm: _confirm }) => (
            <DialogContent className="max-h-[80vh]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center gap-2">
                  <GetStateComponent state={stepStates.source} index={1} />
                  <Divider />
                  <GetStateComponent state={stepStates.bridge} index={2} />
                  <Divider />
                  <GetStateComponent state={stepStates.dest} index={3} />
                </div>
                <div className="text-center">
                  <ConfirmationDialogContent
                    txHash={txHash}
                    dstTxHash={dstTxHash}
                    dstTxExplorerUrl={dstTxExplorerUrl}
                    bridgeUrl={
                      statusData?.swapDetails?.originChainTxHashes?.[0]
                        ?.explorerUrl
                    }
                    dialogState={stepStates}
                    token1={token1}
                    amountOut={amountOut}
                    recipient={recipient}
                    chainId1={chainId1}
                  />
                </div>
                {finishedState(stepStates) && (
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={resetSwap}
                      className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Close
                    </button>
                  </DialogFooter>
                )}
              </div>
            </DialogContent>
          )}
        </DialogReview>
      </DialogProvider>
    )
  }

  return (
    <DialogReview>
      {({ confirm }) => (
        <>
          <ReviewIntro estGasError={estGasError}>{children}</ReviewIntro>
          <DialogContent className="max-h-[80vh]">
            <TradeHeader />
            <DialogBody>
              <TradeWarnings
                showSlippageWarning={showSlippageWarning}
                showPriceImpactWarning={showPriceImpactWarning}
              />
              <TradeDetails />
              <RecipientSection />
            </DialogBody>
            <DialogFooter>
              <ConfirmSwapButton
                confirm={confirm}
                write={write}
                isWritePending={isWritePending}
                isEstGasError={isEstGasError}
                isStepQueryError={isStepQueryError}
                showPriceImpactWarning={showPriceImpactWarning}
                showSlippageWarning={showSlippageWarning}
              />
            </DialogFooter>
          </DialogContent>
        </>
      )}
    </DialogReview>
  )
}
