import { AuctionType } from '@sushiswap/bonds-sdk'

export const convertAuctionTypes = (auctionTypes: AuctionType[]) => {
  const map = {
    [AuctionType.Dynamic]: 'dynamic',
    [AuctionType.Static]: 'static',
  } as const

  return auctionTypes.map((type) => map[type])
}
