import { AuctionTemplate } from 'app/features/miso/context/types'
import React, { FC } from 'react'
import { useWatch } from 'react-hook-form'

import BatchAuctionDetails from './BatchAuctionDetails'
import CrowdsaleDetails from './CrowdsaleDetails'
import DutchAuctionDetails from './DutchAuctionDetails'

const AuctionCreationStepGeneralDetails: FC = () => {
  const auctionType = useWatch({ name: 'auctionType' })
  if (auctionType === AuctionTemplate.DUTCH_AUCTION) {
    return <DutchAuctionDetails />
  }

  if (auctionType === AuctionTemplate.BATCH_AUCTION) {
    return <BatchAuctionDetails />
  }

  if (auctionType === AuctionTemplate.CROWDSALE) {
    return <CrowdsaleDetails />
  }

  return <></>
}

export default AuctionCreationStepGeneralDetails
