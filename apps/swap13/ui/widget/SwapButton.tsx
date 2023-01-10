'use client'

import { Button } from '@sushiswap/ui13/components/button'
import React, { FC } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ApprovalState, ApproveTokenController, Checker } from '@sushiswap/wagmi13'
import { ROUTE_PROCESSOR_ADDRESS } from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { FixedButtonContainer } from '../FixedButtonContainer'
import { useTrade } from '../../lib/useTrade'
import { Dots } from '@sushiswap/ui13/components/Dots'

export const SwapButton: FC = () => {
  const { amount, network0 } = useSwapState()
  const { data: trade } = useTrade()
  const { setReview } = useSwapActions()

  return (
    <ApproveTokenController amount={amount} contract={ROUTE_PROCESSOR_ADDRESS[ChainId.POLYGON]}>
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
                contract={ROUTE_PROCESSOR_ADDRESS[ChainId.POLYGON]}
              >
                <Button disabled={amount && !trade} fullWidth size="xl" onClick={() => setReview(true)}>
                  {amount && !trade ? <Dots>Calculating Output</Dots> : 'Review Swap'}
                </Button>
              </Checker.ApproveERC20>
            </Checker.Amounts>
          </Checker.Network>
        </FixedButtonContainer>
      )}
    </ApproveTokenController>
  )
}
