import { BAD_AUCTIONS } from 'app/features/miso/context/constants'
import { AuctionStatus, RawAuction } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useSingleCallResult } from 'app/lib/hooks/multicall'
import { useMemo } from 'react'

export const useAuctionList = (type?: AuctionStatus): RawAuction[] => {
  const contract = useMisoHelperContract()
  const { result } = useSingleCallResult(contract, 'getMarkets', undefined, { gasRequired: 4_000_000 })

  return useMemo(() => {
    if (!result || !Array.isArray(result) || !(result.length > 0)) return []

    // @ts-ignore TYPE NEEDS FIXING
    let filtered = result[0].filter((el) => !BAD_AUCTIONS.includes(el.addr))
    const currentTimestamp = new Date().getTime()

    if (type === AuctionStatus.LIVE) {
      return filtered.filter(
        // @ts-ignore TYPE NEEDS FIXING
        (auction) =>
          currentTimestamp >= auction.startTime.mul('1000').toNumber() &&
          currentTimestamp < auction.endTime.mul('1000').toNumber() &&
          !auction.finalized
      )
    } else if (type === AuctionStatus.UPCOMING) {
      return filtered.filter(
        // @ts-ignore TYPE NEEDS FIXING
        (auction) => currentTimestamp < auction.startTime.mul('1000').toNumber() && !auction.finalized
      )
    } else if (type === AuctionStatus.FINISHED) {
      return filtered.filter(
        // @ts-ignore TYPE NEEDS FIXING
        (auction) => currentTimestamp > auction.endTime.mul('1000').toNumber() || auction.finalized
      )
    }

    return filtered
  }, [result, type])
}
