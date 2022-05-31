import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import CompletedOrders from 'app/features/legacy/limit-order/CompletedOrders'
import DiscoverHeader from 'app/features/legacy/limit-order/DiscoverHeader'
import LimitOrderApprovalCheck from 'app/features/legacy/limit-order/LimitOrderApprovalCheck'
import OrdersTableToggle from 'app/features/legacy/limit-order/OrderTableToggle'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import NetworkGuard from 'app/guards/Network'
import useBentoMasterApproveCallback, { BentoApprovalState } from 'app/hooks/useBentoMasterApproveCallback'
import { TridentBody } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'

function OpenOrdersPage() {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()
  const masterContract = chainId ? STOP_LIMIT_ORDER_ADDRESS[chainId] : undefined
  const { approve, approvalState } = useBentoMasterApproveCallback(masterContract, {})

  return (
    <>
      <LimitOrderApprovalCheck />
      <DiscoverHeader />
      <TridentBody>
        {pending.totalOrders > 0 &&
          approvalState !== BentoApprovalState.UNKNOWN &&
          approvalState !== BentoApprovalState.APPROVED && (
            <div className="border border-blue-700/40 bg-blue/10 rounded p-4 flex justify-between gap-6">
              <Typography variant="sm" className="text-blue-100">
                {i18n._(t`It seems like you have open orders while the limit order master contract is not yet approved. Please make
          sure you have approved the limit order master contract or the order will not execute`)}
              </Typography>
              <div className="flex justify-end">
                <Button onClick={approve} size="sm" color="blue" loading={approvalState === BentoApprovalState.PENDING}>
                  Approve
                </Button>
              </div>
            </div>
          )}

        <OrdersTableToggle />
        <CompletedOrders />
      </TridentBody>
    </>
  )
}

OpenOrdersPage.Guard = NetworkGuard(Feature.LIMIT_ORDERS)

export default OpenOrdersPage
