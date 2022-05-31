import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import loadingCircle from 'app/animation/loading-circle.json'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import AuctionCommitterSkeleton from 'app/features/miso/AuctionCommitter/AuctionCommitterSkeleton'
import { useAuctionContext } from 'app/features/miso/context/AuctionContext'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import { classNames } from 'app/functions'
import Lottie from 'lottie-react'
import React, { FC, useCallback, useState } from 'react'

const AuctionClaimer: FC = () => {
  const { i18n } = useLingui()
  const { auction, loading } = useAuctionContext()
  const [pending, setPending] = useState(false)
  const { claimTokens, finalizeAuction, withdrawDeposits } = useAuctionEdit(
    auction?.auctionInfo.addr,
    auction?.launcherInfo?.address,
    auction?.template,
    auction?.launcherInfo ? auction.launcherInfo.liquidityTemplate : undefined
  )

  const handleWithdrawDeposits = useCallback(async () => {
    try {
      setPending(true)
      const tx = await withdrawDeposits()
      if (tx?.hash) {
        await tx.wait()
      }
    } finally {
      setPending(false)
    }
  }, [withdrawDeposits])

  const handleFinalize = useCallback(async () => {
    try {
      setPending(true)
      const tx = await finalizeAuction()
      if (tx?.hash) {
        await tx.wait()
      }
    } finally {
      setPending(false)
    }
  }, [finalizeAuction])

  const handleClick = useCallback(async () => {
    try {
      setPending(true)
      const tx = await claimTokens()
      if (tx?.hash) {
        await tx.wait()
      }
    } finally {
      setPending(false)
    }
  }, [claimTokens])

  if (loading || !auction) return <AuctionCommitterSkeleton />

  return (
    <div className="relative mt-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-baseline justify-between gap-2">
          <Typography weight={700} className="text-high-emphesis">
            {auction.canWithdraw ? i18n._(t`Withdraw Tokens`) : i18n._(t`Claim Tokens`)}
          </Typography>
          {auction.minimumTargetRaised && auction.commitmentsTotal?.lessThan(auction.minimumTargetRaised) ? (
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(
                t`The auction has failed to reach its minimum target. You can withdraw a total committed amount of`
              )}{' '}
              {auction.commitmentsTotal?.toSignificant(6)} {auction.commitmentsTotal?.currency.symbol}
            </Typography>
          ) : !auction.auctionInfo.finalized ? (
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(t`This auction has finished successfully! The owner of the auction has to finalize the auction before you can
              claim a total amount of`)}{' '}
              {auction.tokensClaimable?.toSignificant(6)} {auction.tokensClaimable?.currency.symbol}
            </Typography>
          ) : (
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(t`This auction has finished successfully! You can claim a total amount of`)}{' '}
              {auction.tokensClaimable?.toSignificant(6)} {auction.tokensClaimable?.currency.symbol}
            </Typography>
          )}
        </div>
        <Button
          {...(pending && {
            startIcon: (
              <div className="w-4 h-4 mr-1">
                <Lottie animationData={loadingCircle} autoplay loop />
              </div>
            ),
          })}
          onClick={
            auction.canWithdrawDeposits ? handleWithdrawDeposits : auction.canFinalize ? handleFinalize : handleClick
          }
          disabled={
            (!auction.canWithdraw && !auction.canClaim && !auction.canFinalize && !auction.canWithdrawDeposits) ||
            pending
          }
          className={classNames(
            auction.canWithdraw ? 'from-blue to-blue' : 'from-blue to-pink',
            'w-full outline-none h-[74px] bg-gradient-to-r from-blue to-pink transition-all disabled:scale-[1] hover:scale-[1.02] !opacity-100 disabled:!opacity-40'
          )}
        >
          <div className="flex flex-col">
            <Typography className="text-white" weight={700}>
              {auction.canWithdrawDeposits
                ? i18n._(t`Withdraw Deposits`)
                : auction.canFinalize
                ? i18n._(t`Finalize Auction`)
                : auction.canWithdraw
                ? i18n._(t`Withdraw`)
                : auction.canClaim
                ? i18n._(t`Claim`)
                : i18n._(t`Auction Finished`)}
            </Typography>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default AuctionClaimer
