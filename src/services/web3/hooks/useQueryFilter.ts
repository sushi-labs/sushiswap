import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/core-sdk'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

// @ts-ignore TYPE NEEDS FIXING
async function queryFilter(contract: Contract, event, fromBlockOrBlockHash, toBlock) {
  return contract.queryFilter(event, fromBlockOrBlockHash, toBlock)
}

export function useQueryFilter({
  chainId = ChainId.ETHEREUM,
  shouldFetch = true,
  // @ts-ignore TYPE NEEDS FIXING
  contract,
  // @ts-ignore TYPE NEEDS FIXING
  event,
  fromBlockOrBlockHash = undefined,
  toBlock = undefined,
}) {
  return useSWR(
    shouldFetch ? () => ['queryFilter', chainId, stringify(event), fromBlockOrBlockHash, toBlock] : null,
    () => queryFilter(contract, event, fromBlockOrBlockHash, toBlock)
  )
}
