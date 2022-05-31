import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { selectTridentRemove, setRemoveShowReview, setRemoveTxHash } from 'app/features/trident/remove/removeSlice'
import { useRemoveDetails } from 'app/features/trident/remove/useRemoveDetails'
import {
  useRemoveLiquidityDerivedCurrencyAmounts,
  useRemoveLiquidityDerivedSLPAmount,
  useRemoveLiquidityZapCurrency,
} from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import { useRemoveLiquiditySingleExecute } from 'app/features/trident/remove/useRemoveLiquiditySingleExecute'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback, useMemo } from 'react'

import WithdrawalSubmittedModalContent from './WithdrawalSubmittedModalContent'

interface RemoveTransactionReviewSingleModal {}

const RemoveTransactionReviewZapModal: FC<RemoveTransactionReviewSingleModal> = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { showReview, attemptingTxn, txHash, outputToWallet } = useAppSelector(selectTridentRemove)
  const zapCurrency = useRemoveLiquidityZapCurrency()
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()
  const parsedAmounts = useRemoveLiquidityDerivedCurrencyAmounts()
  const { poolShareAfter, poolShareBefore, minLiquidityOutputSingleToken } = useRemoveDetails()
  const execute = useRemoveLiquiditySingleExecute()

  const minOutputAmount = useMemo(() => {
    const amount = minLiquidityOutputSingleToken(zapCurrency)
    if (zapCurrency?.isNative && outputToWallet && amount) {
      return CurrencyAmount.fromRawAmount(zapCurrency, amount.quotient.toString())
    }

    return amount
  }, [minLiquidityOutputSingleToken, outputToWallet, zapCurrency])

  const _execute = useCallback(async () => {
    if (!slpAmountToRemove?.greaterThan(ZERO) || !minOutputAmount?.greaterThan(ZERO)) return

    const tx = await execute(slpAmountToRemove, minOutputAmount)
    if (tx && tx.hash) {
      dispatch(setRemoveTxHash(tx.hash))
    }
  }, [slpAmountToRemove, minOutputAmount, execute, dispatch])

  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      onDismiss={() => dispatch(setRemoveShowReview(false))}
      afterLeave={() => dispatch(setRemoveTxHash(undefined))}
      unmount={false}
      maxWidth="md"
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUIModal.Header
            header={i18n._(t`Confirm remove liquidity`)}
            onClose={() => dispatch(setRemoveShowReview(false))}
          />
          <Typography variant="sm">
            {i18n._(t`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`)}
          </Typography>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`You are removing:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((parsedInputAmount, index) => (
                <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
              ))}
            />
          </HeadlessUIModal.BorderedContent>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`Which will be converted to...`)}
            </Typography>
            <ListPanel items={[<ListPanel.CurrencyAmountItem amount={minOutputAmount} key={0} />]} />
          </HeadlessUIModal.BorderedContent>
          <div className="flex justify-between px-2 py-1">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Share of Pool`)}
            </Typography>
            <Typography weight={700} variant="sm" className="text-high-emphesis text-right">
              {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
              <span className="text-green">{poolShareAfter?.toSignificant(6) || '0.000'}%</span>
            </Typography>
          </div>
          <Button disabled={attemptingTxn} color="blue" onClick={_execute}>
            {i18n._(t`Confirm Withdrawal`)}
          </Button>
        </div>
      ) : (
        <WithdrawalSubmittedModalContent txHash={txHash} onDismiss={() => dispatch(setRemoveTxHash(undefined))} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default RemoveTransactionReviewZapModal
