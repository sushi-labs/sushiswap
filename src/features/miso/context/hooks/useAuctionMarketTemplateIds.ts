import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import BASE_AUCTION_ABI from 'app/constants/abis/base-auction.json'
import { useMultipleContractSingleData } from 'app/lib/hooks/multicall'

const AUCTION_INTERFACE = new Interface(BASE_AUCTION_ABI)

export const useAuctionMarketTemplateIds = (auctions: string[]): (BigNumber | undefined)[] => {
  const results = useMultipleContractSingleData(auctions, AUCTION_INTERFACE, 'marketTemplate')
  if (results && Array.isArray(results) && results.length === auctions.length) {
    return results.map<BigNumber | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return el.result[0]
      }

      return undefined
    })
  }

  return Array(auctions.length).fill(undefined)
}

export default useAuctionMarketTemplateIds
