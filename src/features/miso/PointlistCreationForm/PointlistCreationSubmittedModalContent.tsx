import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import CopyHelper from 'app/components/AccountDetails/Copy'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Lottie from 'lottie-react'
import React, { FC } from 'react'

interface PointListCreationSubmittedModalContentProps {
  txHash?: string
  listAddress?: string
  onDismiss(): void
}

const PointListCreationSubmittedModalContent: FC<PointListCreationSubmittedModalContentProps> = ({
  txHash,
  onDismiss,
  listAddress,
}) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(
        t`Permission list creation transaction successfully submitted. Your newly created point list address will appear here once we receive the event from the blockchain`
      )}
      onDismiss={onDismiss}
    >
      <div className="flex flex-col px-4 py-3 bg-dark-900 rounded border border-dark-700 mt-4">
        <Typography variant="sm" className="text-secondary">
          {i18n._(t`Permission List Address`)}
        </Typography>
        {listAddress ? (
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            <CopyHelper toCopy={listAddress} className="text-high-emphesis opacity-100">
              {listAddress}
            </CopyHelper>
          </Typography>
        ) : (
          <div className="w-4 h-4">
            <Lottie animationData={loadingCircle} autoplay loop />
          </div>
        )}
      </div>
    </HeadlessUiModal.SubmittedModalContent>
  )
}

export default PointListCreationSubmittedModalContent
