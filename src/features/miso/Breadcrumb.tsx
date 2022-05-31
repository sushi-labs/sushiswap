import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import useAuctionEdit from 'app/features/miso/context/hooks/useAuctionEdit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface BreadcrumbProps {
  auction?: Auction
}

const Breadcrumb: FC<BreadcrumbProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const { query } = useRouter()
  const { finalizeAuction } = useAuctionEdit(
    auction?.auctionInfo.addr,
    auction?.launcherInfo?.address,
    auction?.template,
    auction?.launcherInfo?.liquidityTemplate
  )

  if (!auction) return <div className="animate-pulse h-2 mb-2 mt-1 bg-dark-800" />

  return (
    <div className="flex justify-between">
      <Typography variant="sm" weight={700} className="flex gap-2">
        <Link passHref={true} href="/miso">
          <a className="text-secondary">Miso</a>
        </Link>
        <span className="text-secondary">/</span>
        {auction && <span>{auction.auctionToken.name}</span>}
      </Typography>
      <Typography variant="sm" weight={700} className="flex gap-4">
        {auction.isOwner && (
          <Link passHref={true} href={`/miso/${query.auction as string}/admin`}>
            <a className="text-blue">Edit Auction</a>
          </Link>
        )}
        {auction.canFinalize && (
          <span
            role="button"
            onClick={() => finalizeAuction()}
            className="bg-gradient-to-r from-pink-red via-pink to-red bg-clip-text text-transparent"
          >
            {i18n._(t`Finalize Auction`)}
          </span>
        )}
      </Typography>
    </div>
  )
}

export default Breadcrumb
