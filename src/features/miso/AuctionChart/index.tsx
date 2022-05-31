import AuctionChartCrowdsale from 'app/features/miso/AuctionChart/AuctionChartCrowdsale'
import AuctionChartDutch from 'app/features/miso/AuctionChart/AuctionChartDutch'
import { Auction } from 'app/features/miso/context/Auction'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { FC } from 'react'

interface AuctionChartProps {
  auction: Auction
  prices?: boolean
  showPriceIndicator?: boolean
}
const AuctionChart: FC<AuctionChartProps> = ({ auction, prices = true, showPriceIndicator = true }) => {
  if (auction.template === AuctionTemplate.DUTCH_AUCTION) {
    return <AuctionChartDutch auction={auction} prices={prices} showPriceIndicator={showPriceIndicator} />
  }

  return <AuctionChartCrowdsale auction={auction} prices={prices} showPriceIndicator={showPriceIndicator} />
}

export default AuctionChart
