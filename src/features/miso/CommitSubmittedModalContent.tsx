import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import React, { FC } from 'react'

const CommitSubmittedModalContent: FC<{ txHash: string; onDismiss(): void }> = ({ txHash, onDismiss }) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(
        t`Auction commitment successfully submitted. Your commitment will display in the commitments table once we receive the event from the blockchain`
      )}
      onDismiss={onDismiss}
    />
  )
}

export default CommitSubmittedModalContent
