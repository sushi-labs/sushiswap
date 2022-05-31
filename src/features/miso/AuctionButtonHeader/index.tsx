import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { Auction } from 'app/features/miso/context/Auction'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface AuctionEditHeaderProps {
  auction?: Auction
}

const AuctionEditHeader: FC<AuctionEditHeaderProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const router = useRouter()

  const { auction: address } = router.query

  if (!auction?.isOwner) return <></>

  return (
    <div className="flex justify-between rounded gap-2">
      <div>
        <Link passHref={true} href="/miso">
          <a>
            <Button
              color="blue"
              variant="outlined"
              className="rounded-full !pl-2 !py-1.5"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              {i18n._(t`Back`)}
            </Button>
          </a>
        </Link>
      </div>
      <div className="flex gap-2">
        <Link href={`/miso/${address as string}/admin`} passHref={true}>
          <a>
            <Button color="pink" variant="outlined" className="rounded-full h-9">
              {i18n._(t`Edit Auction`)}
            </Button>
          </a>
        </Link>
        <div></div>
      </div>
    </div>
  )
}

export default AuctionEditHeader
