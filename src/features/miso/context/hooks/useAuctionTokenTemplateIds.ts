import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { useContract } from 'app/hooks'
import { useSingleContractMultipleData } from 'app/lib/hooks/multicall'
import { useActiveWeb3React } from 'app/services/web3'

export interface TokenFactoryData {
  exists: boolean
  templateId: number
  index: number
}

export const useAuctionTokenTemplateIds = (addresses: string[]): (TokenFactoryData | undefined)[] => {
  const { chainId } = useActiveWeb3React()
  const tokenFactory = useContract(
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOTokenFactory.address : undefined,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOTokenFactory.abi : undefined
  )

  const results = useSingleContractMultipleData(
    tokenFactory,
    'tokenInfo',
    addresses.map((el) => [el])
  )

  if (results && Array.isArray(results) && results.length === addresses.length) {
    return results.map<TokenFactoryData | undefined>((el) => {
      if (el.result && Array.isArray(el.result) && el.result.length > 0) {
        const [exists, templateId, index] = el.result
        return {
          exists,
          templateId: Number(templateId),
          index: Number(index),
        }
      }

      return undefined
    })
  }

  return Array(addresses.length).fill(undefined)
}

export const useAuctionTokenTemplateId = (address: string): TokenFactoryData | undefined => {
  return useAuctionTokenTemplateIds([address])?.[0]
}
