import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, NATIVE, WNATIVE, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { selectTridentRemove, setRemoveShowReview, setRemoveTxHash } from 'app/features/trident/remove/removeSlice'
import { useRemoveDetails } from 'app/features/trident/remove/useRemoveDetails'
import { useRemoveLiquidityDerivedSLPAmount } from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import { useRemoveLiquidityExecute } from 'app/features/trident/remove/useRemoveLiquidityExecute'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC, useCallback } from 'react'

import WithdrawalSubmittedModalContent from './WithdrawalSubmittedModalContent'

interface RemoveTransactionReviewStandardModal {}

const RemoveTransactionReviewStandardModal: FC<RemoveTransactionReviewStandardModal> = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { receiveNative, outputToWallet, showReview, attemptingTxn, txHash } = useAppSelector(selectTridentRemove)
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()
  const { minLiquidityOutput, poolShareBefore, poolShareAfter } = useRemoveDetails()
  const receiveETH = receiveNative && outputToWallet
  const execute = useRemoveLiquidityExecute()

  const liquidityOutput = minLiquidityOutput.map((el) => {
    if (el?.currency.wrapped.address === WNATIVE[chainId || 1].address && receiveETH) {
      // @ts-ignore TYPE NEEDS FIXING
      return CurrencyAmount.fromRawAmount(NATIVE[chainId || 1], el.quotient.toString())
    }

    return el
  })

  const _execute = useCallback(async () => {
    if (!slpAmountToRemove?.greaterThan(ZERO)) return

    const tx = await execute(slpAmountToRemove, minLiquidityOutput)
    if (tx && tx.hash) {
      dispatch(setRemoveTxHash(tx.hash))
    }
  }, [execute, slpAmountToRemove, minLiquidityOutput, dispatch])

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
              {i18n._(t`You'll receive (at least):`)}
            </Typography>
            <ListPanel
              items={liquidityOutput.map((parsedInputAmount, index) => (
                <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
              ))}
            />
          </HeadlessUIModal.BorderedContent>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {i18n._(t`Deposited to your:`)}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {outputToWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
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
          <Button id="btn-modal-confirm-withdrawal" disabled={attemptingTxn} color="blue" onClick={_execute}>
            {i18n._(t`Confirm Withdrawal`)}
          </Button>
        </div>
      ) : (
        <WithdrawalSubmittedModalContent txHash={txHash} onDismiss={() => dispatch(setRemoveTxHash(undefined))} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default RemoveTransactionReviewStandardModal
