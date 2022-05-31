import { AuctionTemplate, StoreSlice } from 'app/features/miso/context/types'

export interface IAuctionDetails {
  auctionType: AuctionTemplate
  fixedPrice: string | null
  minimumTarget: number | null
  minimumRaised: string | null
  startPrice: string | null
  endPrice: string | null
}

export const auctionDetailsDefaultValues = {
  auctionType: AuctionTemplate.NOT_SET,
  fixedPrice: null,
  minimumRaised: null,
  minimumTarget: null,
  startPrice: null,
  endPrice: null,
}

interface IAuctionDetailsSlice extends IAuctionDetails {
  setAuctionDetails: (_: IAuctionDetails) => void
}

export const createAuctionDetailsSlice: StoreSlice<IAuctionDetailsSlice> = (set) => ({
  ...auctionDetailsDefaultValues,
  setAuctionDetails: (newState) => set(() => newState),
})
