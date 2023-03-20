'use client'

import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, useMemo } from 'react'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'
import { isUniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { getSushiSwapRouterContractConfig, getTridentRouterContractConfig } from '@sushiswap/wagmi'
import { bentoBoxV1Address, BentoBoxV1ChainId, isBentoBoxV1ChainId } from '@sushiswap/bentobox'

export const AddPositionReviewButton: FC = () => {
  const { chainId, amount0, amount1, isTrident, poolQuery } = useAddPositionState()
  const { setReview, setBentoboxSignature } = useAddPositionActions()

  const amounts = useMemo(() => [amount0, amount1], [amount0, amount1])
  const poolNotFound = !poolQuery?.data?.pool && !poolQuery?.isInitialLoading

  return (
    <>
      <>
        {poolNotFound && (
          <div className="bg-blue/10 text-blue rounded-xl p-3 font-medium text-sm">
            This pool doesnt exist yet. Adding liquidity to this pool with automatically create the pool for you. The
            price of the pool with be equal to the ratio of the deposit.
          </div>
        )}
      </>
      <div className="pt-4">
        <Checker.Connect fullWidth size="xl" color="blue" variant="filled">
          <Checker.Network fullWidth size="xl" chainId={chainId}>
            <Checker.Amounts fullWidth size="xl" chainId={chainId} amounts={amounts}>
              {isTrident ? (
                <Checker.ApproveBentobox
                  fullWidth
                  size="xl"
                  chainId={chainId as BentoBoxV1ChainId}
                  id="add-liquidity-trident-approve-bentobox"
                  contract={getTridentRouterContractConfig(chainId).address}
                  onSignature={setBentoboxSignature}
                  enabled={Boolean(getTridentRouterContractConfig(chainId).address)}
                >
                  <Checker.ApproveERC20
                    fullWidth
                    size="xl"
                    id="add-liquidity-trident-approve-token0"
                    amount={amount0}
                    enabled={Boolean(chainId && isBentoBoxV1ChainId(chainId))}
                    contract={chainId ? bentoBoxV1Address[chainId as BentoBoxV1ChainId] : undefined}
                  >
                    <Checker.ApproveERC20
                      fullWidth
                      size="xl"
                      id="add-liquidity-trident-approve-token1"
                      amount={amount1}
                      enabled={Boolean(chainId && isBentoBoxV1ChainId(chainId))}
                      contract={chainId ? bentoBoxV1Address[chainId as BentoBoxV1ChainId] : undefined}
                    >
                      <Button fullWidth size="xl" onClick={() => setReview(true)}>
                        Review Deposit
                      </Button>
                    </Checker.ApproveERC20>
                  </Checker.ApproveERC20>
                </Checker.ApproveBentobox>
              ) : (
                <Checker.ApproveERC20
                  fullWidth
                  size="xl"
                  id="approve-token-0"
                  amount={amount0}
                  contract={
                    isUniswapV2Router02ChainId(chainId) ? getSushiSwapRouterContractConfig(chainId).address : undefined
                  }
                >
                  <Checker.ApproveERC20
                    fullWidth
                    size="xl"
                    id="approve-token-1"
                    amount={amount1}
                    contract={
                      isUniswapV2Router02ChainId(chainId)
                        ? getSushiSwapRouterContractConfig(chainId).address
                        : undefined
                    }
                  >
                    <Button fullWidth size="xl" onClick={() => setReview(true)}>
                      Review Deposit
                    </Button>
                  </Checker.ApproveERC20>
                </Checker.ApproveERC20>
              )}
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </div>
    </>
  )
}
