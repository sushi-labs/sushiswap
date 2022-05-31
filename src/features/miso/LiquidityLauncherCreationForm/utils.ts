import { Auction } from 'app/features/miso/context/Auction'
import {
  LiquidityLauncherFormInputFormatted,
  LiquidityLauncherFormInputValidated,
} from 'app/features/miso/LiquidityLauncherCreationForm/index'

export const formatData = (
  data: LiquidityLauncherFormInputValidated,
  auction: Auction
): LiquidityLauncherFormInputFormatted => {
  return {
    auctionAddress: auction.auctionInfo.addr,
    adminAddress: data.adminAddress,
    liqPercentage: data.liqPercentage,
    liqLockTime: data.liqLockTime * 3600 * 24,
    tokenAddress: auction.auctionToken.address,
    tokenSupply: auction.totalTokens,
  }
}
