import { ChainId } from '@sushiswap/chain'
import type { getToken as _getToken } from '@sushiswap/tokens-api/lib/api'
import { TokenApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/address'
import { TOKENS_API } from 'src/constants'
import { GetApiInputFromOutput, SWRHookConfig } from 'src/types'
import useSWR from 'swr'

export { TokenApiSchema }
export type Token = Awaited<ReturnType<typeof _getToken>>
// Slightly opinionated, adding string to support the chainId:address format
export type GetTokenArgs =
  | GetApiInputFromOutput<(typeof TokenApiSchema)['_input'], (typeof TokenApiSchema)['_output']>
  | string

export const getTokenUrl = (args: GetTokenArgs) => {
  let chainId
  let address
  if (typeof args === 'string') {
    ;[chainId, address] = args.split(':') as [ChainId, string]
  } else {
    ;[chainId, address] = [args.chainId, args.address]
  }

  return `${TOKENS_API}/api/v0/${chainId}/${address}`
}

export const getToken = async (args: GetTokenArgs): Promise<Token> => {
  return fetch(getTokenUrl(args)).then((data) => data.json())
}

export const useToken = ({ args, shouldFetch }: SWRHookConfig<GetTokenArgs>) => {
  return useSWR<Token>(shouldFetch !== false ? getTokenUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
