import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import { ModalActionProps } from 'app/components/Modal/Action'
import { HeadlessUiModal } from 'app/components/Modal/index'
import Typography from 'app/components/Typography'
import { getExplorerLink, shortenString } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAllTransactions } from 'app/state/transactions/hooks'
import Lottie from 'lottie-react'
import React, { FC, ReactElement, useMemo } from 'react'

import { ModalHeaderProps } from './Header'

export interface SubmittedModalContentProps extends ModalHeaderProps {
  animationData?: Object
  txHash?: string
  onDismiss(): void
  onBack?(): void
  actions?: ReactElement<ModalActionProps> | ReactElement<ModalActionProps>[]
}

const SubmittedModalContent: FC<SubmittedModalContentProps> = ({
  header,
  children,
  subheader,
  animationData,
  txHash = '',
  onDismiss,
  onBack,
  actions,
}) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const tx = useMemo(() => allTransactions[txHash], [allTransactions, txHash])
  const txStatus = !tx?.receipt
    ? 'PENDING'
    : tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
    ? 'SUCCESS'
    : tx.receipt.status === 1337
    ? 'CANCELLED'
    : 'FAILED'
  return (
    <HeadlessUiModal.Body>
      {animationData && (
        <div className="w-[102px] h-[102px] rounded-full flex justify-center p-6">
          <Lottie animationData={animationData} autoplay loop={false} />
        </div>
      )}
      <HeadlessUiModal.Header onClose={onDismiss} onBack={onBack} header={header} subheader={subheader} />
      <HeadlessUiModal.Content>
        <div className="flex flex-col divide-y divide-dark-700">
          <div className="flex justify-between gap-2 py-2">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Transaction Hash`)}
            </Typography>
            {txHash && (
              <Typography variant="sm" weight={700} className="text-blue">
                <a target="_blank" rel="noreferrer" href={getExplorerLink(chainId, txHash, 'transaction')}>
                  {shortenString('0x376c05d690faac163bb042b8755ea3c604776b3743f70c5ee4eda503f284ff1c', 12)}
                </a>
              </Typography>
            )}
          </div>

          <div className="flex justify-between gap-2 py-2">
            <Typography variant="sm" className="text-secondary">
              {i18n._(t`Status`)}
            </Typography>
            <Typography id={`div-tx-status`} variant="sm" weight={700} className="flex items-center gap-2 italic">
              {txStatus === 'PENDING'
                ? i18n._(t`Processing`)
                : txStatus === 'SUCCESS'
                ? i18n._(t`Success`)
                : txStatus === 'CANCELLED'
                ? i18n._(t`Cancelled`)
                : txStatus === 'FAILED'
                ? i18n._(t`Failed`)
                : ''}
              {txStatus === 'PENDING' ? (
                <div className="w-4 h-4">
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              ) : txStatus === 'SUCCESS' ? (
                <CheckCircleIcon className="w-4 h-4 text-green" />
              ) : txStatus === 'CANCELLED' || txStatus === 'FAILED' ? (
                <XCircleIcon className="w-4 h-4 text-high-emphesis" />
              ) : (
                ''
              )}
            </Typography>
          </div>
        </div>
        {children}
      </HeadlessUiModal.Content>
      <HeadlessUiModal.Actions>
        <HeadlessUiModal.Action main={!actions} onClick={onDismiss}>
          {i18n._(t`Close`)}
        </HeadlessUiModal.Action>
        {actions}
      </HeadlessUiModal.Actions>
    </HeadlessUiModal.Body>
  )
}

export default SubmittedModalContent
