import useAuctionTemplateMap from 'app/features/miso/context/hooks/useAuctionTemplateMap'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { useContract } from 'app/hooks'
import { useSingleCallResult } from 'app/lib/hooks/multicall'

export const useAuctionEnded = (address?: string, auctionTemplate?: AuctionTemplate) => {
  const { map } = useAuctionTemplateMap()
  const { abi } = auctionTemplate && map ? map[auctionTemplate] : { abi: undefined }
  const contract = useContract(address, abi)
  const { result } = useSingleCallResult(contract, 'auctionEnded')

  if (result && Array.isArray(result) && result.length > 0) {
    return result[0]
  }

  return undefined
}
