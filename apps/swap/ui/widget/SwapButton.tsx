'use client'

import { Button } from '@sushiswap/ui13/components/button'
import React, { FC } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ApprovalState, ApproveTokenController, Checker } from '@sushiswap/wagmi13'
import { ChainId } from '@sushiswap/chain'
import { FixedButtonContainer } from '../FixedButtonContainer'
import { useTrade } from '../../lib/useTrade'
import { Native } from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui13/types'
import { getRouteProcessorAddressForChainId } from 'lib/getRouteProcessorAddressForChainId'

export const SwapButton: FC = () => {
  const { appType, amount, network0, value, token0, token1 } = useSwapState()
  const { isFetching, isLoading } = useTrade()
  const { setReview } = useSwapActions()

  const isWrap =
    appType === AppType.Swap && token0.isNative && token1.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1.isNative && token0.wrapped.address === Native.onChain(network0).wrapped.address

  return (
    <ApproveTokenController amount={amount} contract={getRouteProcessorAddressForChainId(ChainId.POLYGON)}>
      {({ approvalState }) => (
        <FixedButtonContainer>
          {approvalState === ApprovalState.NOT_APPROVED && (
            <p className="text-center text-xs text-blue cursor-pointer">What is an approval?</p>
          )}
          <Checker.Network fullWidth size="xl" chainId={ChainId.POLYGON}>
            <Checker.Amounts fullWidth size="xl" chainId={network0} amounts={[amount]}>
              <Checker.ApproveERC20
                id="approve-erc20"
                fullWidth
                size="xl"
                amount={amount}
                contract={getRouteProcessorAddressForChainId(ChainId.POLYGON)}
              >
                <Button
                  disabled={Boolean(isLoading && +value > 0) || isFetching}
                  fullWidth
                  size="xl"
                  onClick={() => setReview(true)}
                >
                  {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'}
                </Button>
              </Checker.ApproveERC20>
            </Checker.Amounts>
          </Checker.Network>
        </FixedButtonContainer>
      )}
    </ApproveTokenController>
  )
}
