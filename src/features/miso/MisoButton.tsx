import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, NativeCurrency, Token } from '@sushiswap/core-sdk'
import LoadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import { Auction } from 'app/features/miso/context/Auction'
import { AuctionStatus } from 'app/features/miso/context/types'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import Lottie from 'lottie-react'
import React, { FC } from 'react'

interface MisoButtonProps {
  auction: Auction
  amount?: CurrencyAmount<Token | NativeCurrency>
  error: boolean
}

const MisoButton: FC<MisoButtonProps> = ({ auction, amount, children, error }) => {
  const { i18n } = useLingui()
  const [approvalState, approve] = useApproveCallback(amount, auction.auctionInfo.addr)

  if ((!error && approvalState === ApprovalState.NOT_APPROVED) || approvalState === ApprovalState.PENDING) {
    return (
      <Button
        disabled={auction.status === AuctionStatus.FINISHED || approvalState === ApprovalState.PENDING}
        size="lg"
        color="blue"
        onClick={approve}
        {...(approvalState === ApprovalState.PENDING && {
          startIcon: (
            <div className="w-4 h-4 mr-1">
              <Lottie animationData={LoadingCircle} autoplay loop />
            </div>
          ),
        })}
      >
        {auction.status === AuctionStatus.FINISHED ? i18n._(t`Sale Finished`) : i18n._(t`Approve`)}
      </Button>
    )
  }

  return <>{children}</>
}

export default MisoButton
