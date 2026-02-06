'use client'

import { getBase64Encoder } from '@solana/codecs-strings'
import { useKitTransactionSigner } from '@solana/connector'
import type { Base64EncodedWireTransaction } from '@solana/kit'
import {
  getBase64EncodedWireTransaction,
  getTransactionDecoder,
} from '@solana/transactions'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { SupportedChainId } from 'src/config'
import type { UseSvmTradeReturn } from 'src/lib/hooks/react-query'
import { useSvmTradeExecute } from 'src/lib/hooks/react-query'
import { getSvmRpc } from 'src/lib/svm/rpc'
import { waitForSvmSignature } from 'src/lib/svm/wait-for-svm-signature'
import { useAccount, useWallet } from 'src/lib/wallet'
import { Percent } from 'sushi'
import {
  type SvmAddress,
  type SvmChainId,
  type SvmCurrency,
  isSvmChainId,
} from 'sushi/svm'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { isUnwrapTrade, isWrapTrade } from '../common'
import {
  useDerivedStateSimpleSwap,
  useSvmSimpleSwapTradeQuote,
} from '../derivedstate-simple-swap-provider'
import type { UseSimpleSwapTradeReviewBaseReturn } from './use-simple-swap-trade-review'

const zeroPercent = new Percent(0)
const base64Encoder = getBase64Encoder()
const transactionDecoder = getTransactionDecoder()

export function useSvmSimpleSwapTradeReview(): UseSimpleSwapTradeReviewBaseReturn {
  const { state: _state } = useDerivedStateSimpleSwap<
    SvmChainId & SupportedChainId
  >()

  const state = isSvmChainId(_state.chainId)
    ? _state
    : {
        chainId: undefined,
        recipient: undefined,
        token0: undefined,
        token1: undefined,
      }

  return _useSvmSimpleSwapTradeReview(state)
}

function _useSvmSimpleSwapTradeReview({
  chainId,
  recipient,
  token0,
  token1,
}: {
  chainId: (SvmChainId & SupportedChainId) | undefined
  recipient: SvmAddress | undefined
  token0: SvmCurrency | undefined
  token1: SvmCurrency | undefined
}) {
  const address = useAccount('svm')
  const { signer } = useKitTransactionSigner()

  const {
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap<SvmChainId & SupportedChainId>()
  const { refetchChain } = useRefetchBalances()

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const isDialogOpen = confirmDialogOpen || reviewDialogOpen
  const { state } = useDerivedStateSimpleSwap<SvmChainId & SupportedChainId>()
  const {
    data: trade,
    isFetching: isSwapQueryFetching,
    isSuccess: isSwapQuerySuccess,
    isError: isSwapQueryError,
    error: swapQueryError,
  } = useSvmSimpleSwapTradeQuote()

  const order = trade?.route
  const executeMutation = useSvmTradeExecute({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: state.swapAmount,
    recipient,
    enabled: Boolean(address && isDialogOpen),
    order,
  })

  const tradeRef = useRef<UseSvmTradeReturn | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending',
  )

  const isWrap = isWrapTrade(token0, token1)
  const isUnwrap = isUnwrapTrade(token0, token1)

  const onSwapError = useCallback(
    (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Something went wrong'
      if (message.toLowerCase().includes('rejected')) {
        return
      }
      sendAnalyticsEvent(SwapEventName.SWAP_ERROR, {
        chain_id: chainId,
        error: message,
        requestId: order?.requestId,
      })
      createErrorToast(message, false)
    },
    [chainId, order?.requestId],
  )

  const write = useMemo(() => {
    if (!chainId || !trade || !signer || !address) {
      return undefined
    }

    const getUnsignedTransaction = async () => {
      if (isWrap || isUnwrap) {
        return trade?.tx as Base64EncodedWireTransaction
      }

      return order?.transaction
    }

    return async (confirm: () => void) => {
      setIsSigning(true)
      setStatus('pending')
      try {
        const unsignedTransaction = await getUnsignedTransaction()

        if (!unsignedTransaction) {
          throw new Error('Failed to build Solana transaction')
        }

        const unsignedBytes = base64Encoder.encode(unsignedTransaction)
        const unsignedTx = transactionDecoder.decode(unsignedBytes)
        const [signedTx] = await signer.modifyAndSignTransactions([unsignedTx])

        tradeRef.current = trade

        const signedTransaction = getBase64EncodedWireTransaction(signedTx)
        const executePromise = executeMutation.mutateAsync({
          requestId: order?.requestId,
          signedTransaction,
        })

        const signature = await executePromise
        if (!signature) {
          throw new Error('Missing Solana transaction signature')
        }

        setTxHash(signature)
        const confirmationPromise = waitForSvmSignature(signature)

        const actionVerb = isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'
        const actionPreposition = isWrap || isUnwrap ? 'to' : 'for'

        void createToast({
          account: address,
          type: 'swap',
          chainId,
          txHash: signature,
          promise: confirmationPromise,
          summary: {
            pending: `${actionVerb}ping ${trade?.amountIn?.toSignificant(6)} ${trade?.amountIn?.currency.symbol} ${actionPreposition} ${trade?.amountOut?.toSignificant(6)} ${trade?.amountOut?.currency.symbol}`,
            completed: `${actionVerb} ${trade?.amountIn?.toSignificant(6)} ${trade?.amountIn?.currency.symbol} ${actionPreposition} ${trade?.amountOut?.toSignificant(6)} ${trade?.amountOut?.currency.symbol}`,
            failed: `Something went wrong when trying to ${actionVerb.toLowerCase()} ${trade?.amountIn?.currency.symbol} ${actionPreposition} ${trade?.amountOut?.currency.symbol}`,
          },
          timestamp: Date.now(),
          groupTimestamp: Date.now(),
        })

        sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
          txHash: signature,
          chainId,
        })

        confirm()

        await confirmationPromise
          .then(() => {
            setStatus('success')
            sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_COMPLETED, {
              txHash: signature,
              chain_id: chainId,
            })
          })
          .catch(() => {
            setStatus('error')
            sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_FAILED, {
              txHash: signature,
              chain_id: chainId,
            })
          })
      } catch (error) {
        setStatus('error')
        onSwapError(error)
      } finally {
        setSwapAmount('')
        refetchChain(chainId)
        setIsSigning(false)
      }
    }
  }, [
    address,
    chainId,
    executeMutation,
    isUnwrap,
    isWrap,
    onSwapError,
    order,
    refetchChain,
    setSwapAmount,
    signer,
    trade,
  ])

  return {
    trade,
    tradeRef,
    write,
    isWritePending: isSigning || executeMutation.isPending,
    txHash,
    status,
    slippagePercent: zeroPercent,
    isSwapQueryFetching,
    isSwapQuerySuccess,
    isSwapQueryError,
    isWrap,
    isUnwrap,
    swapQueryError,
  }
}
