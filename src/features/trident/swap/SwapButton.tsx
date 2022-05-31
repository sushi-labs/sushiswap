import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent, Trade as LegacyTrade, TradeVersion } from '@sushiswap/core-sdk'
import { Trade as TridentTrade } from '@sushiswap/trident-sdk'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import Typography from 'app/components/Typography'
import { useDerivedTridentSwapContext } from 'app/features/trident/swap/DerivedTradeContext'
import { selectTridentSwap, setBentoPermit, setTridentSwapState } from 'app/features/trident/swap/swapSlice'
import { computeFiatValuePriceImpact, warningSeverity } from 'app/functions'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import confirmPriceImpactWithoutFee from 'app/functions/prices'
import { useBentoBoxContract, useRouterContract, useTridentRouterContract } from 'app/hooks'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import { TradeUnion } from 'app/types'
import { Signature } from 'ethers'
import React, { FC, useCallback, useMemo, useState } from 'react'

import TridentApproveGate from '../TridentApproveGate'

interface SwapButton {
  onClick(x: TradeUnion): void
  spendFromWallet?: boolean
}

const SwapButton: FC<SwapButton> = ({ onClick, spendFromWallet = true }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const tridentSwapState = useAppSelector(selectTridentSwap)
  const { attemptingTxn, bentoPermit } = tridentSwapState
  const { parsedAmounts, error, trade } = useDerivedTridentSwapContext()
  const router = useTridentRouterContract()
  const legacyRouterContract = useRouterContract()
  const bentoBox = useBentoBoxContract()
  const fiatValueInput = useUSDCValue(parsedAmounts?.[0])
  const fiatValueOutput = useUSDCValue(parsedAmounts?.[1])
  const computedPriceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)
  const [isExpertMode] = useExpertModeManager()
  const [permitError, setPermitError] = useState<boolean>()
  const [permit, setPermit] = useState<Signature>()

  const priceImpact = useMemo(() => {
    if (trade instanceof LegacyTrade) {
      const executionPriceImpact = trade?.priceImpact
      return executionPriceImpact && computedPriceImpact
        ? executionPriceImpact.greaterThan(computedPriceImpact)
          ? executionPriceImpact
          : computedPriceImpact
        : executionPriceImpact ?? computedPriceImpact
    } else if (trade instanceof TridentTrade) {
      return new Percent(Math.floor(Number(trade.route.priceImpact) * 10_000), 10_000)
    }
  }, [computedPriceImpact, trade])

  const priceImpactSeverity = useMemo(() => warningSeverity(priceImpact), [priceImpact])

  const handleClick = useCallback(() => {
    if (!trade || !priceImpact || !confirmPriceImpactWithoutFee(priceImpact)) return
    onClick(trade)
    dispatch(setTridentSwapState({ ...tridentSwapState, showReview: true }))
  }, [dispatch, onClick, priceImpact, trade, tridentSwapState])

  const isLegacy = getTradeVersion(trade) === TradeVersion.V2TRADE

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="p-4 text-center border rounded border-yellow/40 text-yellow">
          {i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve BentoBox' again for approving using the fallback method`
          )}
        </Typography>
      )}
      <TridentApproveGate
        inputAmounts={[parsedAmounts?.[0]]}
        tokenApproveOn={spendFromWallet ? (!isLegacy ? bentoBox?.address : legacyRouterContract?.address) : undefined}
        masterContractAddress={!isLegacy ? router?.address : undefined}
        {...(!isLegacy
          ? {
              withPermit: true,
              permit: bentoPermit,
              onPermit: (permit) => {
                dispatch(setBentoPermit(permit))
              },
              onPermitError: () => setPermitError(true),
            }
          : { withPermit: false })}
      >
        {({ approved, loading }) => {
          const disabled =
            !!error || !approved || loading || attemptingTxn || (priceImpactSeverity > 3 && !isExpertMode)
          const buttonText = attemptingTxn ? (
            <Dots>{i18n._(t`Swapping`)}</Dots>
          ) : loading ? (
            ''
          ) : error ? (
            error
          ) : priceImpactSeverity > 3 && !isExpertMode ? (
            i18n._(t`Price Impact Too High`)
          ) : priceImpactSeverity > 2 ? (
            i18n._(t`Swap Anyway`)
          ) : (
            i18n._(t`Swap`)
          )

          return (
            <div className="flex">
              <Button
                fullWidth
                id="swap-button"
                loading={loading}
                color={priceImpactSeverity > 2 && !error ? 'red' : 'gradient'}
                disabled={disabled}
                onClick={handleClick}
                className="rounded-2xl md:rounded"
              >
                {buttonText}
              </Button>
            </div>
          )
        }}
      </TridentApproveGate>
    </>
  )
}

export default SwapButton
