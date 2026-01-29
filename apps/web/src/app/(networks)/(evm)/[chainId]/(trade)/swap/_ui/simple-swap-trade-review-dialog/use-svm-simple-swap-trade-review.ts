'use client'

import { DialogType, useDialog } from '@sushiswap/ui'
import { useRef } from 'react'
import type { SupportedChainId } from 'src/config'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { SVM_FALLBACK_ACCOUNT } from 'src/lib/svm/config'
import { useAccount } from 'src/lib/wallet'
import { Percent } from 'sushi'
import {
  type SvmAddress,
  type SvmChainId,
  type SvmCurrency,
  isSvmChainId,
} from 'sushi/svm'
import { isUnwrapTrade, isWrapTrade } from '../common'
import {
  useDerivedStateSimpleSwap,
  useSvmSimpleSwapTradeExecute,
} from '../derivedstate-simple-swap-provider'
import type { UseSimpleSwapTradeReviewBaseReturn } from './use-simple-swap-trade-review'

const zeroPercent = new Percent(0)

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
  recipient,
  token0,
  token1,
}: {
  chainId: (SvmChainId & SupportedChainId) | undefined
  recipient: SvmAddress | undefined
  token0: SvmCurrency | undefined
  token1: SvmCurrency | undefined
}) {
  const address = useAccount('svm') || SVM_FALLBACK_ACCOUNT

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const {
    data: trade,
    isFetching: isSwapQueryFetching,
    isSuccess: isSwapQuerySuccess,
    isError: isSwapQueryError,
    error: swapQueryError,
  } = useSvmSimpleSwapTradeExecute(
    Boolean(address && (confirmDialogOpen || reviewDialogOpen)),
  )

  console.log(
    isSwapQueryFetching,
    isSwapQuerySuccess,
    isSwapQueryError,
    swapQueryError,
  )

  const tradeRef = useRef<UseSvmTradeReturn | null>(null)

  const isWrap = isWrapTrade(token0, token1)
  const isUnwrap = isUnwrapTrade(token0, token1)

  return {
    trade,
    tradeRef,
    write: () => Promise.resolve(),
    isWritePending: false,
    txHash: undefined,
    status: 'success' as const,
    slippagePercent: zeroPercent,
    isSwapQueryFetching,
    isSwapQuerySuccess,
    isSwapQueryError,
    isWrap,
    isUnwrap,
    swapQueryError,
  }
}
