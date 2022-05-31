import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AuctionAboutTab from 'app/features/miso/AuctionTabs/AuctionAboutTab'
import AuctionBidsTab from 'app/features/miso/AuctionTabs/AuctionBidsTab'
import AuctionDetailsTab from 'app/features/miso/AuctionTabs/AuctionDetailsTab'
import { useAuctionContext } from 'app/features/miso/context/AuctionContext'
import { classNames } from 'app/functions'
import React, { FC, useMemo, useState } from 'react'

import AuctionTabsSkeleton from './AuctionTabsSkeleton'

const AuctionTabs: FC = () => {
  const { i18n } = useLingui()
  const { loading, auction } = useAuctionContext()
  const [tab, setTab] = useState(0)

  const tabs = useMemo(() => {
    const documents = auction?.auctionDocuments
    const isAboutTab = (documents?.description || documents?.bannedCountries || documents?.bannedWarning) ?? false

    const tabs = [i18n._(t`Auction Details`), i18n._(t`Commitments`)]
    if (isAboutTab) tabs.push(i18n._(t`About Project`))

    return tabs
  }, [auction, i18n])

  if (loading || !auction) return <AuctionTabsSkeleton />

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex mb-4 space-x-8 overflow-x-auto overflow-y-hidden border-b whitespace-nowrap border-dark-800"
        aria-label="Tabs"
      >
        {tabs.map((_tab, index) => (
          <div key={_tab} onClick={() => setTab(index)} className="h-full space-y-2 cursor-pointer">
            <div
              className={classNames(
                index === tab ? 'text-high-emphesis' : '',
                'capitalize font-bold text-sm text-secondary'
              )}
            >
              {_tab}
            </div>
            <div
              className={classNames(
                index === tab ? 'relative bg-gradient-to-r from-red via-pink to-red h-[3px] w-full' : ''
              )}
            />
          </div>
        ))}
      </div>
      <AuctionDetailsTab auction={auction} active={tab === 0} />
      <AuctionBidsTab auction={auction} active={tab === 1} />
      <AuctionAboutTab auction={auction} active={tab === 2} />
    </div>
  )
}

export default AuctionTabs
