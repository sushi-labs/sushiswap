import { ConstantProductPoolState, PairState, StablePoolState } from '@sushiswap/wagmi'
import { ConstantProductPool, Pair, StablePool } from '@sushiswap/amm'
import React, { useCallback } from 'react'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'
import { isUniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { AddSectionReviewModalTrident } from './AddSectionReviewModalTrident'
import { AddSectionReviewModalLegacy } from './AddSectionReviewModalLegacy'
import { CreateSectionReviewModalTrident } from './AddSectionReviewModalTridentCreate'

export const AddPositionReviewModal = () => {
  const { chainId, token0, token1, amount0, amount1, poolQuery, poolType, fee, bentoboxSignature, review } =
    useAddPositionState()
  const { setReview } = useAddPositionActions()
  const pool = poolQuery?.data?.pool

  const close = useCallback(() => setReview(false), [setReview])

  if (pool instanceof ConstantProductPool && isBentoBoxV1ChainId(chainId)) {
    return (
      <AddSectionReviewModalTrident
        poolAddress={pool.liquidityToken.address}
        poolState={pool ? ConstantProductPoolState.EXISTS : ConstantProductPoolState.NOT_EXISTS}
        pool={pool}
        chainId={chainId}
        token0={token0}
        token1={token1}
        input0={amount0}
        input1={amount1}
        permit={bentoboxSignature}
        open={review}
        close={close}
      />
    )
  }

  if (pool instanceof StablePool && isBentoBoxV1ChainId(chainId)) {
    return (
      <AddSectionReviewModalTrident
        poolAddress={pool.liquidityToken.address}
        poolState={pool ? StablePoolState.EXISTS : StablePoolState.NOT_EXISTS}
        pool={pool}
        chainId={chainId}
        token0={token0}
        token1={token1}
        input0={amount0}
        input1={amount1}
        permit={bentoboxSignature}
        open={review}
        close={close}
      />
    )
  }

  if (pool instanceof Pair && isUniswapV2Router02ChainId(chainId)) {
    return (
      <AddSectionReviewModalLegacy
        poolState={pool ? PairState.EXISTS : PairState.NOT_EXISTS}
        chainId={chainId}
        token0={token0}
        token1={token1}
        input0={amount0}
        input1={amount1}
        open={review}
        close={close}
      />
    )
  }

  if (isBentoBoxV1ChainId(chainId)) {
    return (
      <CreateSectionReviewModalTrident
        chainId={chainId}
        token0={token0}
        token1={token1}
        input0={amount0}
        input1={amount1}
        fee={fee}
        poolType={poolType}
        open={review}
        close={close}
        permit={bentoboxSignature}
      />
    )
  }

  return <></>
}
