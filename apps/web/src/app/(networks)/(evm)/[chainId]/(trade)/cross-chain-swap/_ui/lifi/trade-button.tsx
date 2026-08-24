'use client'

import { DialogTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { warningSeverity } from 'src/lib/swap/warning-severity'
import { isChainIdSupportedByWallet } from 'src/lib/wagmi/config/wallet'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { ApproveERC20 } from 'src/lib/wagmi/systems/checker/approve-erc20'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import {
  SLIPPAGE_WARNING_THRESHOLD,
  Slippage,
} from 'src/lib/wagmi/systems/checker/slippage'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import { useWallet } from 'src/lib/wallet/hooks/use-wallet'
import { getNamespaceForChainId } from 'src/lib/wallet/namespaces/namespace-for-chain-id'
import { ZERO } from 'sushi'
import { CrossChainSwapChainUnsupportedMessage } from './chain-unsupported-message'
import { CrossChainSwapTradeReviewDialog } from './trade-review-dialog'
import { useIsCrossChainSwapMaintenance } from './use-is-maintenance'
import { useLifiXSwap, useLifiXSwapSelectedTradeRoute } from './xswap-provider'

export function CrossChainSwapTradeButton<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const { data: maintenance } = useIsCrossChainSwapMaintenance()
  const {
    state: { swapAmount, swapAmountString, chainId0, chainId1 },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const { data: route, isError } = useLifiXSwapSelectedTradeRoute()
  const [checked, setChecked] = useState(false)
  const [slippagePercent] = useSlippageTolerance()

  const connector = useWallet(chainId1)

  const showChainUnsupportedWarning = useMemo(
    () =>
      connector?.id
        ? !isChainIdSupportedByWallet({
            chainId: chainId1,
            walletId: connector.id,
          })
        : false,
    [chainId1, connector?.id],
  )

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(route?.priceImpact)
    return priceImpactSeverity > 3
  }, [route?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [slippagePercent])

  // Reset
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [showPriceImpactWarning, checked])

  return (
    <CrossChainSwapTradeReviewDialog>
      <div>
        <Guard guardWhen={maintenance} guardText="Maintenance in progress">
          <Connect fullWidth namespace={getNamespaceForChainId(chainId0)}>
            <Connect fullWidth namespace={getNamespaceForChainId(chainId1)}>
              <Network fullWidth chainId={chainId0}>
                <Amounts fullWidth chainId={chainId0} amount={swapAmount}>
                  <Slippage
                    fullWidth
                    text="Swap With High Slippage"
                    slippageTolerance={slippagePercent}
                  >
                    <ApproveERC20
                      id="approve-erc20"
                      fullWidth
                      amount={swapAmount}
                      contract={
                        route?.step?.estimate?.approvalAddress as
                          | AddressFor<TChainId0>
                          | undefined
                      }
                    >
                      <Success tag={APPROVE_TAG_XSWAP}>
                        <DialogTrigger asChild>
                          <Button
                            disabled={Boolean(
                              !route?.amountOut?.gt(ZERO) ||
                                isError ||
                                +swapAmountString === 0 ||
                                (!checked && showPriceImpactWarning) ||
                                showChainUnsupportedWarning,
                            )}
                            color={showPriceImpactWarning ? 'red' : 'blue'}
                            fullWidth
                            size="xl"
                            testId="swap"
                          >
                            {!checked && showPriceImpactWarning
                              ? 'Price impact too high'
                              : isError
                                ? 'No trade found'
                                : 'Swap'}
                          </Button>
                        </DialogTrigger>
                      </Success>
                    </ApproveERC20>
                  </Slippage>
                </Amounts>
              </Network>
            </Connect>
          </Connect>
        </Guard>
      </div>
      {showChainUnsupportedWarning && (
        <CrossChainSwapChainUnsupportedMessage
          className="mt-4"
          walletName={connector?.name}
        />
      )}
      {showSlippageWarning && <SlippageWarning className="mt-4" />}
      {showPriceImpactWarning && (
        <PriceImpactWarning
          className="mt-4"
          checked={checked}
          setChecked={setChecked}
        />
      )}
    </CrossChainSwapTradeReviewDialog>
  )
}
