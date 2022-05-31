import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import React, { FC } from 'react'

interface WithdrawSubmittedModalContent {
  txHash: string
  onBack?(): void
  onDismiss(): void
}

const WithdrawSubmittedModalContent: FC<WithdrawSubmittedModalContent> = ({ txHash, onBack, onDismiss }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Withdraw Submitted`)}
      onBack={onBack}
      onDismiss={onDismiss}
    />
  )
}

export default WithdrawSubmittedModalContent
