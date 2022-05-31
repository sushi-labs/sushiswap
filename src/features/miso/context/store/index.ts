import { createAuctionDetailsSlice } from 'app/features/miso/context/store/createAuctionDetailsSlice'
import { createGeneralDetails } from 'app/features/miso/context/store/createGeneralDetailsSlice'
import { createLiquidityDetailsSlice } from 'app/features/miso/context/store/createLiquidityDetailsSlice'
import { createTokenDetailsSlice } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { createWhitelistDetailsSlice } from 'app/features/miso/context/store/createWhitelistDetailsSlice'
import create, { GetState, SetState } from 'zustand'

const createRootSlice = (set: SetState<any>, get: GetState<any>) => ({
  ...createTokenDetailsSlice(set, get),
  ...createGeneralDetails(set, get),
  ...createAuctionDetailsSlice(set, get),
  ...createLiquidityDetailsSlice(set, get),
  ...createWhitelistDetailsSlice(set, get),
})

export const useStore = create(createRootSlice)
