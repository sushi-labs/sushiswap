import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import SubmittedModalContent from 'app/components/Modal/SubmittedModalContent'
import Typography from 'app/components/Typography'
import { KashiMarketView, KashiMarketWithdrawButtonProps, useWithdrawExecute } from 'app/features/kashi/KashiMarket'
import { KashiMarketLentDetailsView } from 'app/features/kashi/KashiMarket/KashiMarketLentDetailsView'
import React, { FC, useCallback, useState } from 'react'

interface KashiMarketWithdrawReviewModal extends KashiMarketWithdrawButtonProps {
  open: boolean
  onDismiss(): void
  permit?: Signature
}

export const KashiMarketWithdrawReviewModal: FC<KashiMarketWithdrawReviewModal> = ({
  withdrawAmount,
  receiveToWallet,
  open,
  onDismiss,
  permit,
  removeMax,
}) => {
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const execute = useWithdrawExecute()

  const _execute = useCallback(async () => {
    setAttemptingTxn(true)

    try {
      const tx = await execute({
        withdrawAmount,
        receiveToWallet,
        permit,
        removeMax,
      })

      if (tx?.hash) {
        setTxHash(tx.hash)
      }
    } finally {
      setAttemptingTxn(false)
    }
  }, [execute, permit, receiveToWallet, removeMax, withdrawAmount])

  return (
    <HeadlessUiModal.Controlled
      isOpen={open}
      onDismiss={onDismiss}
      maxWidth="md"
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Confirm Withdraw`)} onClose={onDismiss} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40 !border-dark-700">
            <div className="flex flex-col gap-2">
              <Typography variant="xs" className="text-secondary">
                {i18n._(t`Withdrawing`)}
              </Typography>
              <div className="inline-flex gap-2">
                <CurrencyLogo currency={withdrawAmount?.currency} size={20} />
                <b>
                  {withdrawAmount?.toSignificant(6)} {withdrawAmount?.currency.symbol}
                </b>
              </div>
            </div>
          </HeadlessUiModal.BorderedContent>
          <KashiMarketLentDetailsView view={KashiMarketView.WITHDRAW} lentAmount={withdrawAmount} />
          <Button loading={attemptingTxn} color="gradient" disabled={attemptingTxn} onClick={_execute}>
            {i18n._(t`Confirm Withdraw`)}
          </Button>
        </div>
      ) : (
        <SubmittedModalContent
          header={i18n._(t`Success!`)}
          subheader={i18n._(t`Success! Withdraw Submitted`)}
          txHash={txHash}
          onDismiss={onDismiss}
        />
      )}
    </HeadlessUiModal.Controlled>
  )
}
