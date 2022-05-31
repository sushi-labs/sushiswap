import { Signature } from '@ethersproject/bytes'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import SubmittedModalContent from 'app/components/Modal/SubmittedModalContent'
import Typography from 'app/components/Typography'
import { KashiMarketView, useDepositExecute } from 'app/features/kashi/KashiMarket'
import { KashiMarketLentDetailsView } from 'app/features/kashi/KashiMarket/KashiMarketLentDetailsView'
import React, { FC, useCallback, useState } from 'react'

import { KashiMarketDepositButtonProps } from './KashiMarketDepositButton'

interface KashiMarketDepositReviewModal extends KashiMarketDepositButtonProps {
  open: boolean
  onDismiss(): void
  permit?: Signature
}

export const KashiMarketDepositReviewModal: FC<KashiMarketDepositReviewModal> = ({
  depositAmount,
  spendFromWallet,
  open,
  onDismiss,
  permit,
}) => {
  const { i18n } = useLingui()
  const [txHash, setTxHash] = useState<string>()
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const execute = useDepositExecute()

  console.log('KashiMarketDepositReviewModal', permit)

  const onClick = useCallback(async () => {
    setAttemptingTxn(true)

    try {
      const tx = await execute({
        depositAmount,
        spendFromWallet,
        permit,
      })

      if (tx?.hash) {
        setTxHash(tx.hash)
      }
    } finally {
      setAttemptingTxn(false)
    }
  }, [depositAmount, execute, permit, spendFromWallet])

  return (
    <HeadlessUiModal.Controlled
      isOpen={open}
      onDismiss={onDismiss}
      maxWidth="md"
      afterLeave={() => setTxHash(undefined)}
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Confirm Deposit`)} onClose={onDismiss} />
          <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40 !border-dark-700">
            <div className="flex flex-col gap-2">
              <Typography variant="xs" className="text-secondary">
                {i18n._(t`Depositing`)}
              </Typography>
              <div className="inline-flex gap-2">
                <CurrencyLogo currency={depositAmount?.currency} size={20} />
                <b>
                  {depositAmount?.toSignificant(6)} {depositAmount?.currency.symbol}
                </b>
              </div>
            </div>
          </HeadlessUiModal.BorderedContent>
          <KashiMarketLentDetailsView view={KashiMarketView.DEPOSIT} lentAmount={depositAmount} />
          <Button loading={attemptingTxn} color="gradient" disabled={attemptingTxn} onClick={onClick}>
            {i18n._(t`Confirm Deposit`)}
          </Button>
        </div>
      ) : (
        <SubmittedModalContent
          header={i18n._(t`Success!`)}
          subheader={i18n._(t`Success! Deposit Submitted`)}
          txHash={txHash}
          onDismiss={onDismiss}
        />
      )}
    </HeadlessUiModal.Controlled>
  )
}
