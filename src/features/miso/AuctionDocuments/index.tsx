import { AddressZero } from '@ethersproject/constants'
import { DocumentTextIcon, GlobeIcon, LockClosedIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Chip from 'app/components/Chip'
import {
  DiscordIcon,
  GithubIcon,
  MediumIcon,
  RedditIcon,
  RestrictedIcon,
  TelegramIcon,
  TokenomicsIcon,
  TwitterIcon,
  WechatIcon,
} from 'app/components/Icon'
import Typography from 'app/components/Typography'
import AuctionDocumentsSkeleton from 'app/features/miso/AuctionDocuments/AuctionDocumentsSkeleton'
import AuctionIcon from 'app/features/miso/AuctionIcon'
import { useAuctionContext } from 'app/features/miso/context/AuctionContext'
import { AuctionTitleByTemplateId } from 'app/features/miso/context/utils'
import React, { FC } from 'react'

const AuctionDocuments: FC = () => {
  const { i18n } = useLingui()
  const { auction, loading } = useAuctionContext()

  if (loading || !auction) return <AuctionDocumentsSkeleton />

  const info = ['website', 'whitepaper', 'docs']
  const documents = auction.auctionDocuments

  return (
    <>
      <div className="flex items-center gap-4">
        {auction.auctionDocuments.category ? (
          <Chip label={auction.auctionDocuments.category} color="blue" />
        ) : (
          <Chip label={i18n._(t`Uncategorized`)} className="opacity-40" />
        )}
        <div className="flex gap-1.5">
          <AuctionIcon auctionTemplate={auction.template} width={18} />
          <Typography variant="sm" weight={700} className="text-secondary">
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {AuctionTitleByTemplateId(i18n)[auction.template]}
          </Typography>
        </div>

        {auction.pointListAddress !== AddressZero && (
          <div className="flex gap-1.5">
            <LockClosedIcon width={18} />
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(t`Private`)}
            </Typography>
          </div>
        )}

        {documents?.bannedCountries && (
          <div className="flex gap-1.5">
            <RestrictedIcon width={18} className="text-yellow" />
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(t`Restricted`)}
            </Typography>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="sm" weight={700} className="text-low-emphesis">
          {i18n._(t`Technical Information`)}
        </Typography>
        <div className="flex gap-4">
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {info.filter((el) => !!documents?.[el]).length === 0 && (
            <Typography variant="sm" className="italic">
              {i18n._(t`No documents provided`)}
            </Typography>
          )}
          {documents?.website && (
            <a href={documents.website} target="_blank" rel="noreferrer">
              <div className="flex gap-2">
                <GlobeIcon width={20} />
                <Typography variant="sm" weight={700} className="underline text-high-emphesis">
                  {i18n._(t`Website`)}
                </Typography>
              </div>
            </a>
          )}
          {documents?.whitepaper && (
            <a href={documents.whitepaper} target="_blank" rel="noreferrer">
              <div className="flex gap-2">
                <DocumentTextIcon width={20} />
                <Typography variant="sm" weight={700} className="underline text-high-emphesis">
                  {i18n._(t`Whitepaper`)}
                </Typography>
              </div>
            </a>
          )}
          {documents?.tokenomics && (
            <a href={documents.tokenomics} target="_blank" rel="noreferrer">
              <div className="flex gap-2">
                <TokenomicsIcon width={18} />
                <Typography variant="sm" weight={700} className="underline text-high-emphesis">
                  {i18n._(t`Tokenomics`)}
                </Typography>
              </div>
            </a>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="sm" weight={700} className="text-low-emphesis">
          {i18n._(t`Socials`)}
        </Typography>
        <div className="flex items-center gap-5">
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {info.filter((el) => !!documents?.[el]).length === 0 && (
            <Typography variant="sm" className="italic">
              {i18n._(t`No socials provided`)}
            </Typography>
          )}
          {documents?.github && (
            <a href={documents.github} target="_blank" rel="noreferrer" className="cursor-pointer">
              <GithubIcon width={20} height={20} />
            </a>
          )}
          {documents?.telegram && (
            <a href={documents.telegram} target="_blank" rel="noreferrer" className="cursor-pointer">
              <TelegramIcon width={20} height={20} />
            </a>
          )}
          {documents?.wechat && (
            <a href={documents.wechat} target="_blank" rel="noreferrer" className="cursor-pointer">
              <WechatIcon width={20} height={20} />
            </a>
          )}
          {documents?.discord && (
            <a href={documents.discord} target="_blank" rel="noreferrer" className="cursor-pointer">
              <DiscordIcon width={20} height={20} />
            </a>
          )}
          {documents?.medium && (
            <a href={documents.medium} target="_blank" rel="noreferrer" className="cursor-pointer">
              <MediumIcon width={20} height={20} />
            </a>
          )}
          {documents?.reddit && (
            <a href={documents.reddit} target="_blank" rel="noreferrer" className="cursor-pointer">
              <RedditIcon width={20} height={20} />
            </a>
          )}
          {documents?.twitter && (
            <a href={documents.twitter} target="_blank" rel="noreferrer" className="cursor-pointer">
              <TwitterIcon width={20} height={20} />
            </a>
          )}
        </div>
      </div>
    </>
  )
}

export default AuctionDocuments
