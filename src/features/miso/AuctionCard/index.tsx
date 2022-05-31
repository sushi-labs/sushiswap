import { AddressZero } from '@ethersproject/constants'
import { LockClosedIcon } from '@heroicons/react/outline'
import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Chip from 'app/components/Chip'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { RestrictedIcon } from 'app/components/Icon'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import AuctionCardPrice from 'app/features/miso/AuctionCard/AuctionCardPrice'
import AuctionChart from 'app/features/miso/AuctionChart'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import AuctionTimer from 'app/features/miso/AuctionTimer'
import { AuctionStatus } from 'app/features/miso/context/types'
import {
  AuctionHelperTextByTemplateId,
  AuctionPriceHelperTextByTemplateId,
  AuctionStatusById,
  AuctionTitleByTemplateId,
} from 'app/features/miso/context/utils'
import { classNames, formatNumber } from 'app/functions'
import { cloudinaryLoader } from 'app/functions/cloudinary'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

import { Auction } from '../context/Auction'
import AuctionSkeleton from './AuctionSkeleton'

const AuctionCard: FC<{ auction?: Auction; link?: boolean }> = ({ auction, link = true }) => {
  const { i18n } = useLingui()

  if (!auction) {
    return <AuctionSkeleton />
  }

  const content = (
    <div
      className="overflow-hidden bg-cover border rounded shadow-md cursor-pointer border-dark-800 hover:border-dark-600"
      {...(auction.auctionDocuments.icon && {
        style: {
          backgroundImage: `url("${cloudinaryLoader({ src: auction.auctionDocuments.icon, width: 48 })}")`,
        },
      })}
    >
      <div className="bg-dark-900 relative flex flex-col gap-3 z-[10]">
        <div className="flex items-center justify-between pt-3 pl-3 pr-3">
          <div className="flex gap-2">
            {auction.pointListAddress !== AddressZero && (
              <div className="flex gap-1.5 items-center">
                <LockClosedIcon width={14} />
                <Typography variant="xxs" weight={700} className="text-secondary">
                  {i18n._(t`Private`)}
                </Typography>
              </div>
            )}
            {auction.auctionDocuments.bannedCountries && (
              <div className="flex gap-1.5 items-center">
                <RestrictedIcon width={14} className="text-yellow" />
                <Typography variant="xxs" weight={700} className="text-secondary">
                  {i18n._(t`Restricted`)}
                </Typography>
              </div>
            )}
          </div>
          {auction.auctionDocuments.category ? (
            <Chip label={auction.auctionDocuments.category} color="blue" />
          ) : (
            <Chip label={i18n._(t`Uncategorized`)} className="opacity-40" />
          )}
        </div>
        <div className="flex gap-3 px-3">
          {auction.auctionDocuments.icon && (
            <div className="relative min-w-[48px] h-[48px] shadow-md rounded-full">
              <div
                className={classNames(
                  auction.status === AuctionStatus.LIVE
                    ? 'bg-green'
                    : auction.status === AuctionStatus.FINISHED
                    ? 'bg-pink'
                    : 'bg-blue',
                  'absolute top-[-2px] right-[-2px] rounded-full w-3.5 h-3.5 shadow-md shadow-dark-800 z-10'
                )}
              />
              <Image
                alt="logo"
                src={cloudinaryLoader({ src: auction.auctionDocuments.icon, width: 48 })}
                width={48}
                height={48}
                layout="responsive"
                className="rounded-full"
              />
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <Typography variant="sm" weight={700} className="text-secondary">
              {auction.auctionToken.symbol}
            </Typography>
            <Typography variant="h3" weight={700} className="truncate text-high-emphesis">
              {auction.auctionToken.name}
            </Typography>
          </div>
        </div>

        <div className={classNames('flex items-center justify-between p-3 bg-dark-800')}>
          <div className="flex items-center">
            <div className="flex gap-3">
              <AuctionIcon auctionTemplate={auction.template} width={18} height={14} />
              <Typography variant="xs" weight={700}>
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {AuctionTitleByTemplateId(i18n)[auction.template]}
              </Typography>
            </div>
            <QuestionHelper
              // @ts-ignore TYPE NEEDS FIXING
              text={AuctionHelperTextByTemplateId(i18n)[auction.template]}
              icon={<SolidQuestionMarkCircleIcon width={12} height={12} />}
            />
          </div>
          <Typography
            variant="xs"
            weight={700}
            className={
              auction.status === AuctionStatus.LIVE
                ? 'text-green'
                : auction.status === AuctionStatus.FINISHED
                ? 'text-pink'
                : auction.status === AuctionStatus.UPCOMING
                ? 'text-blue'
                : ''
            }
          >
            {AuctionStatusById(i18n)[auction.status]}
          </Typography>
        </div>
        <div className="flex justify-between px-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center">
              <Typography variant="xxs" weight={700} className="uppercase text-secondary">
                {i18n._(t`Current Token Price`)}
              </Typography>
              <QuestionHelper
                // @ts-ignore TYPE NEEDS FIXING
                text={AuctionPriceHelperTextByTemplateId(i18n)[auction.template]}
                icon={<SolidQuestionMarkCircleIcon width={10} height={10} className="text-secondary mb-[2px]" />}
              />
            </div>
            <Typography variant="xs" weight={700}>
              {formatNumber(auction.tokenPrice?.toSignificant(6))} {auction.tokenPrice?.quoteCurrency.symbol}
            </Typography>
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography variant="xxs" weight={700} className="uppercase text-secondary">
              {i18n._(t`Amount for sale`)}
            </Typography>
            <Typography variant="xs" weight={700}>
              {formatNumber(auction.totalTokens?.toSignificant(6))} {auction.totalTokens?.currency.symbol}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col">
          <AuctionChart auction={auction} prices={false} showPriceIndicator={false} />
          <div className={classNames('flex flex-col flex-grow px-3 px-4 py-2 divide-y bg-dark-800 divide-dark-700')}>
            <div className="flex justify-between gap-0.5 py-2">
              <div className="flex items-center">
                <Typography variant="xs" weight={700} className="text-high-emphesis">
                  {i18n._(t`Auction Price`)}
                </Typography>
                <QuestionHelper
                  // @ts-ignore TYPE NEEDS FIXING
                  text={AuctionHelperTextByTemplateId(i18n)[auction.template]}
                  icon={<SolidQuestionMarkCircleIcon width={12} height={12} />}
                />
              </div>
              <div className="relative flex items-center">
                <div className="!w-4 !h-4 absolute -left-7 -top-2">
                  <CurrencyLogo
                    currency={auction.paymentToken}
                    size={32}
                    className="!rounded-full overflow-hidden transform scale-[0.5]"
                  />
                </div>
                <Typography variant="xs" weight={700} className="text-high-emphesis">
                  <AuctionCardPrice auction={auction} />
                </Typography>
              </div>
            </div>
            {auction.remainingPercentage && (
              <div className="flex justify-between gap-0.5 py-2">
                <Typography variant="xs">{i18n._(t`Tokens remaining`)}</Typography>
                <Typography variant="xs" className="text-high-emphesis">
                  {auction.remainingPercentage.toSignificant(6)}%
                </Typography>
              </div>
            )}
            <div className="flex justify-between gap-0.5 py-2">
              <Typography variant="xs">{i18n._(t`Total Raised`)}</Typography>
              <Typography variant="xs" className="text-high-emphesis">
                {auction.commitmentsTotal?.toSignificant(6)} {auction?.commitmentsTotal?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-between gap-0.5 py-2">
              <Typography variant="xs">{i18n._(t`Time Remaining`)}</Typography>
              <Typography variant="xs">
                <AuctionTimer auction={auction} />
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!link) return content

  return (
    <Link href={`/miso/${auction.auctionInfo.addr}`} passHref={true}>
      <a>{content}</a>
    </Link>
  )
}

export default AuctionCard
