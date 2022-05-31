import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import LoadingCircle from 'app/animation/loading-circle.json'
import CopyHelper from 'app/components/AccountDetails/Copy'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import Lottie from 'lottie-react'
import React, { FC } from 'react'

interface TokenCreationSubmittedModalContentProps {
  txHash?: string
  tokenAddress?: string
  onDismiss(): void
}

const TokenCreationSubmittedModalContent: FC<TokenCreationSubmittedModalContentProps> = ({
  txHash,
  onDismiss,
  tokenAddress,
}) => {
  const { i18n } = useLingui()

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(
        t`Token creation transaction successfully submitted. Your newly created token address will appear here once we receive the event from the blockchain`
      )}
      onDismiss={onDismiss}
      actions={
        <HeadlessUiModal.Action
          main={true}
          disabled={!tokenAddress}
          {...(!tokenAddress && {
            startIcon: (
              <div className="w-4 h-4 mr-1">
                <Lottie animationData={LoadingCircle} autoplay loop />
              </div>
            ),
          })}
        >
          <a
            href={`/miso/auction?token=${tokenAddress}`}
            target="_blank"
            rel="noreferrer"
            className={!tokenAddress ? 'pointer-events-none' : ''}
          >
            {i18n._(t`Create auction`)}
          </a>
        </HeadlessUiModal.Action>
      }
    >
      <div className="flex flex-col px-4 py-3 bg-dark-900 rounded border border-dark-700 mt-4">
        <Typography variant="sm" className="text-secondary">
          {i18n._(t`Token Address`)}
        </Typography>
        {tokenAddress ? (
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            <CopyHelper toCopy={tokenAddress} className="text-high-emphesis opacity-100">
              {tokenAddress}
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

export default TokenCreationSubmittedModalContent
