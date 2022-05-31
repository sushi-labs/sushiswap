import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import React from 'react'

interface TransactionFailedModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function TransactionFailedModal({ isOpen, onDismiss }: TransactionFailedModalProps) {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={onDismiss} maxWidth="md">
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={i18n._(t`Transaction Rejected`)} onClose={onDismiss} />
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-1 text-center">
          <Typography variant="lg" weight={700} className="text-pink-red" component="span">
            {i18n._(t`Oops!`)}{' '}
          </Typography>
          <Typography variant="sm" weight={700} className="text-primary" component="span">
            {i18n._(t`Your transaction got rejected`)}
          </Typography>
        </HeadlessUiModal.BorderedContent>
        <Typography variant="xs" className="text-secondary text-center" component="span">
          {i18n._(t`Please try again`)}
        </Typography>
      </div>
    </HeadlessUiModal.Controlled>
  )
}
