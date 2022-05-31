import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import React, { FC } from 'react'

interface PoolCreationSubmittedModalContent {
  txHash: string
  onDismiss(): void
}

export const PoolCreationSubmittedModalContent: FC<PoolCreationSubmittedModalContent> = ({ txHash, onDismiss }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Pool Creation Submitted`)}
      onDismiss={onDismiss}
    />
  )
}
