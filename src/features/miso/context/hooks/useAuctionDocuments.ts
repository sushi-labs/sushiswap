import { AuctionDocument } from 'app/features/miso/context/types'
import { useMisoHelperContract } from 'app/hooks'
import { useSingleContractMultipleData } from 'app/lib/hooks/multicall'

export interface DocumentInput {
  name: string
  data: string
}

// @ts-ignore TYPE NEEDS FIXING
const arrayToMap = (result) =>
  // @ts-ignore TYPE NEEDS FIXING
  result.reduce((acc, cur) => {
    acc[cur.name] = cur.data
    return acc
  }, {})

export const useAuctionDocuments = (addresses: string[]): (AuctionDocument | undefined)[] => {
  const contract = useMisoHelperContract()
  const results = useSingleContractMultipleData(
    contract,
    'getDocuments',
    addresses.map((el) => [el])
  )

  if (results && Array.isArray(results) && results.length === addresses.length) {
    return results.map<AuctionDocument | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        return arrayToMap(el.result[0])
      }

      return undefined
    })
  }

  return Array(addresses.length).fill(undefined)
}

export default useAuctionDocuments
