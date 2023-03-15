import { PairState } from '@sushiswap/wagmi'
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
  const poolState = poolQuery?.data?.[0]
  const pool = poolQuery?.data?.[1]

  const close = useCallback(() => setReview(false), [setReview])

  if ((pool instanceof ConstantProductPool || pool instanceof StablePool) && isBentoBoxV1ChainId(chainId)) {
    return (
      <AddSectionReviewModalTrident
        poolAddress={pool.liquidityToken.address}
        // @ts-ignore
        poolState={poolState}
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
        poolState={poolState as PairState}
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

  // if (isBentoBoxV1ChainId(chainId)) {
  //   return (
  //     <CreateSectionReviewModalTrident
  //       chainId={chainId}
  //       token0={token0}
  //       token1={token1}
  //       input0={amount0}
  //       input1={amount1}
  //       fee={fee}
  //       poolType={poolType}
  //       open={review}
  //       close={close}
  //       permit={bentoboxSignature}
  //     />
  //   )
  // }

  return <></>
}
