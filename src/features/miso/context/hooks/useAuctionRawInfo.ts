import { BigNumber } from '@ethersproject/bignumber'
import { AuctionTemplate, RawAuctionInfo } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useSingleContractWithCallData } from 'app/lib/hooks/multicall'
import { useMemo } from 'react'

export const useAuctionRawInfos = (
  auctions: string[],
  templateIds?: (BigNumber | undefined)[]
): (RawAuctionInfo | undefined)[] => {
  const contract = useMisoHelperContract(false)

  const callsData = useMemo(() => {
    if (
      !contract ||
      !templateIds ||
      templateIds.length !== auctions.length ||
      templateIds.some((templateId) => !templateId)
    )
      return []
    return auctions.map((value, index) => {
      if (templateIds[index]!!.toNumber() === AuctionTemplate.BATCH_AUCTION) {
        return contract.interface.encodeFunctionData('getBatchAuctionInfo', [value])
      } else if (templateIds[index]!!.toNumber() === AuctionTemplate.DUTCH_AUCTION) {
        return contract.interface.encodeFunctionData('getDutchAuctionInfo', [value])
      } else {
        return contract.interface.encodeFunctionData('getCrowdsaleInfo', [value])
      }
    })
  }, [auctions, contract, templateIds])

  const results = useSingleContractWithCallData(contract, callsData)

  if (results && Array.isArray(results) && results.length === auctions.length) {
    return results.map<RawAuctionInfo | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return el.result[0]
      }

      return undefined
    })
  }

  return Array(auctions.length).fill(undefined)
}

export default useAuctionRawInfos
