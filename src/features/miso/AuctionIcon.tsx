import { BatchAuctionIcon, CrowdsaleIcon, DutchAuctionIcon } from 'app/components/Icon'
import { AuctionTemplate } from 'app/features/miso/context/types'
import * as React from 'react'
import { FC } from 'react'

interface AuctionIcon extends React.ComponentProps<'svg'> {
  auctionTemplate: AuctionTemplate
}

const AuctionIcon: FC<AuctionIcon> = ({ auctionTemplate, ...props }) => {
  if (auctionTemplate === AuctionTemplate.CROWDSALE) {
    return <CrowdsaleIcon {...props} />
  }

  if (auctionTemplate === AuctionTemplate.DUTCH_AUCTION) {
    return <DutchAuctionIcon {...props} />
  }

  if (auctionTemplate === AuctionTemplate.BATCH_AUCTION) {
    return <BatchAuctionIcon {...props} />
  }

  return <></>
}

export default AuctionIcon
