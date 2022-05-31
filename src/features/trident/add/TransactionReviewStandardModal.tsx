import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { selectTridentAdd, setAddShowReview, setAddTxHash } from 'app/features/trident/add/addSlice'
import { useAddDetails } from 'app/features/trident/add/useAddDetails'
import { useAddLiquidityDerivedCurrencyAmounts } from 'app/features/trident/add/useAddLiquidityDerivedState'
import { useAddLiquidityExecute } from 'app/features/trident/add/useAddLiquidityExecute'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { FC, useCallback } from 'react'

import DepositSubmittedModalContent from './DepositSubmittedModalContent'

const TransactionReviewStandardModal: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { currencies } = usePoolContext()
  const { attemptingTxn, showReview, txHash, spendFromWallet, bentoPermit } = useAppSelector(selectTridentAdd)
  const { liquidityMinted, poolShareAfter, poolShareBefore } = useAddDetails()
  const execute = useAddLiquidityExecute()
  const _parsedAmounts = useAddLiquidityDerivedCurrencyAmounts()

  const _execute = useCallback(async () => {
    const tx = await execute({ parsedAmounts: _parsedAmounts, liquidityMinted, spendFromWallet, bentoPermit })
    if (tx?.hash) {
      dispatch(setAddTxHash(tx.hash))
    }
  }, [execute, _parsedAmounts, liquidityMinted, spendFromWallet, bentoPermit, dispatch])

  // Trick for performance since useUSDCValue is blocking
  const parsedAmounts = [
    _parsedAmounts[0] || (currencies?.[0] ? CurrencyAmount.fromRawAmount(currencies[0], '0') : undefined),
    _parsedAmounts[1] || (currencies?.[1] ? CurrencyAmount.fromRawAmount(currencies[1], '0') : undefined),
  ]

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => dispatch(setAddShowReview(false))}
      afterLeave={() => dispatch(setAddTxHash(undefined))}
      maxWidth="md"
      unmount={false}
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUIModal.Header
            header={i18n._(t`Confirm add liquidity`)}
            onClose={() => dispatch(setAddShowReview(false))}
          />
          <Typography variant="sm">
            {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
          </Typography>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You are depositing:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((cur, index) => (
                <ListPanel.CurrencyAmountItem amount={cur} key={index} />
              ))}
            />
          </HeadlessUIModal.BorderedContent>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You'll receive (at least):`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {liquidityMinted?.toSignificant(6)} SLP
            </Typography>
          </HeadlessUIModal.BorderedContent>
          <div className="flex justify-between px-2 py-1">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Share of Pool`)}
            </Typography>
            <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
              {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
              {poolShareAfter?.toSignificant(6) || '0.000'}%
            </Typography>
          </div>
          <Button id={`btn-modal-confirm-deposit`} disabled={attemptingTxn} color="blue" onClick={_execute}>
            {i18n._(t`Confirm Deposit`)}
          </Button>
        </div>
      ) : (
        <DepositSubmittedModalContent txHash={txHash} onDismiss={() => dispatch(setAddTxHash(undefined))} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default TransactionReviewStandardModal
