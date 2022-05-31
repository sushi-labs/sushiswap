import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { featureEnabled } from 'app/functions'
import useBentoMasterApproveCallback, { BentoApprovalState } from 'app/hooks/useBentoMasterApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
// @ts-ignore
import cookie from 'cookie-cutter'
import React, { FC, useState } from 'react'

const LimitOrderApprovalCheck: FC = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { pending } = useLimitOrders()
  const { approve, approvalState } = useBentoMasterApproveCallback(
    chainId ? STOP_LIMIT_ORDER_ADDRESS[chainId] : undefined,
    {}
  )
  const [dismissed, setDismissed] = useState<boolean>()

  const isOpen =
    pending.totalOrders > 0 &&
    approvalState === BentoApprovalState.NOT_APPROVED &&
    !cookie.get('disableLimitOrderGuard') &&
    typeof dismissed !== 'undefined' &&
    !dismissed

  if (chainId && !featureEnabled(Feature.LIMIT_ORDERS, chainId)) return <></>

  return (
    <HeadlessUIModal.Controlled isOpen={isOpen} onDismiss={() => setDismissed(true)} maxWidth="sm">
      <div className="flex flex-col gap-4">
        <HeadlessUIModal.Header header={i18n._(t`Approve Master Contract`)} onClose={() => setDismissed(true)} />
        <HeadlessUIModal.BorderedContent className="bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(t`It seems like you have open orders while the limit order master contract is not approved. Please make
          sure you approved the limit order master contract or the order will not execute`)}
          </Typography>
        </HeadlessUIModal.BorderedContent>
        <div className="flex justify-end gap-6">
          <Button color="blue" size="sm" variant="empty" onClick={() => cookie.set('disableLimitOrderGuard', true)}>
            {i18n._(t`Do not show again`)}
          </Button>
          <Button loading={approvalState === BentoApprovalState.PENDING} color="blue" size="sm" onClick={approve}>
            {i18n._(t`Approve`)}
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default LimitOrderApprovalCheck
